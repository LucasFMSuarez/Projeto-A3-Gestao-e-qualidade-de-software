const { criarObservacao, listarObservacoes, processarEvento } = require("../../observacoes/src/servicoObservacoes");
const Observacao = require("../../banco/ObservacaoModel");
const { enviarEvento } = require("../../observacoes/src/distribuidorEventos");
const { v4: uuidv4 } = require("uuid");

jest.mock("uuid", () => ({ v4: jest.fn() }));

jest.mock("../../observacoes/src/distribuidorEventos", () => ({
  enviarEvento: jest.fn()
}));

jest.mock("../../banco/ObservacaoModel", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn()
}));

describe("Serviço de Observações", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("criarObservacao cria uma observação e envia evento", async () => {
    uuidv4.mockReturnValue("abc123");

    const fakeObs = {
      id: "abc123",
      texto: "Nova observação",
      lembreteId: 1,
      status: "aguardando"
    };

    Observacao.create.mockResolvedValue(fakeObs);

    const result = await criarObservacao(1, "Nova observação");

    expect(Observacao.create).toHaveBeenCalledWith({
      id: "abc123",
      texto: "Nova observação",
      lembreteId: 1,
      status: "aguardando"
    });

    expect(enviarEvento).toHaveBeenCalledWith("ObservacaoCriada", {
      id: "abc123",
      texto: "Nova observação",
      lembreteId: 1,
      status: "aguardando"
    });

    expect(result).toEqual(fakeObs);
  });

  test("listarObservacoes retorna lista de observações", async () => {
    const fakeList = [
      { id: "1", texto: "Teste", lembreteId: 1, status: "feito" }
    ];
    Observacao.find.mockResolvedValue(fakeList);

    const result = await listarObservacoes(1);
    expect(Observacao.find).toHaveBeenCalledWith({ lembreteId: 1 });
    expect(result).toEqual(fakeList);
  });

  test("processarEvento atualiza status quando recebe ObservacaoClassificada", async () => {
    const obs = {
      id: "xyz",
      texto: "Teste",
      lembreteId: 1,
      status: "aguardando",
      save: jest.fn()
    };

    Observacao.findOne.mockResolvedValue(obs);

    await processarEvento("ObservacaoClassificada", { id: "xyz", status: "feito" });

    expect(obs.status).toBe("feito");
    expect(obs.save).toHaveBeenCalled();

    expect(enviarEvento).toHaveBeenCalledWith("ObservacaoAtualizada", {
      id: "xyz",
      texto: "Teste",
      lembreteId: 1,
      status: "feito"
    });
  });

  test("processarEvento ignora tipos desconhecidos", async () => {
    await processarEvento("EventoInexistente", { id: "123" });
    expect(enviarEvento).not.toHaveBeenCalled();
  });
});
