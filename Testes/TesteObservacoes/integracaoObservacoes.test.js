const { criarObservacao, listarObservacoes, processarEvento } = require("../../observacoes/src/servicoObservacoes");
const Observacao = require("../../banco/ObservacaoModel");
const { enviarEvento } = require("../../observacoes/src/distribuidorEventos");

jest.mock("../../banco/ObservacaoModel");
jest.mock("../../observacoes/src/distribuidorEventos", () => ({
  enviarEvento: jest.fn()
}));

describe("Integração — Serviço de Observações", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Fluxo completo: criar observação → classificar → atualizar", async () => {
    // 1️⃣ Criar observação
    const fakeObs = {
      id: "1",
      texto: "Teste",
      lembreteId: "100",
      status: "aguardando",
      save: jest.fn()
    };

    Observacao.create.mockResolvedValue(fakeObs);
    Observacao.findOne.mockResolvedValue(fakeObs);
    Observacao.find.mockResolvedValue([fakeObs]);

    const servico = require("../../observacoes/src/servicoObservacoes");

    // Criação
    const criada = await servico.criarObservacao("100", "Teste");

    expect(criada).toEqual(fakeObs);
    expect(enviarEvento).toHaveBeenCalledWith("ObservacaoCriada", expect.any(Object));

    // 2️⃣ Processar evento de classificação
    await servico.processarEvento("ObservacaoClassificada", { id: "1", status: "feito" });

    expect(fakeObs.status).toBe("feito");
    expect(fakeObs.save).toHaveBeenCalled();
    expect(enviarEvento).toHaveBeenCalledWith("ObservacaoAtualizada", expect.objectContaining({
      id: "1",
      status: "feito"
    }));

    // 3️⃣ Listar observações
    const lista = await servico.listarObservacoes("100");
    expect(lista).toEqual([fakeObs]);
  });

  test("Ignora evento desconhecido sem erro", async () => {
    const servico = require("../../observacoes/src/servicoObservacoes");
    await servico.processarEvento("EventoInexistente", { id: "999" });
    expect(enviarEvento).not.toHaveBeenCalled();
  });
});
