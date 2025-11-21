const servico = require("../../observacoes/src/servicoObservacoes");
const Observacao = require("../../banco/ObservacaoModel");
const { enviarEvento } = require("../../observacoes/src/distribuidorEventos");
const { v4: uuidv4 } = require("uuid");

jest.mock("uuid", () => ({ v4: jest.fn() }));
jest.mock("../../banco/ObservacaoModel");
jest.mock("../../observacoes/src/distribuidorEventos", () => ({
  enviarEvento: jest.fn()
}));

describe("Testes simples do serviço de Observações", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("criarObservacao cria e manda evento", async () => {
    uuidv4.mockReturnValue("1");

    const fake = {
      id: "1",
      texto: "Nova observação",
      lembreteId: 1,
      status: "aguardando"
    };

    Observacao.create.mockResolvedValue(fake);

    const result = await servico.criarObservacao(1, "Nova observação");

    expect(result).toEqual(fake);
    expect(enviarEvento).toHaveBeenCalled();
  });

  test("listarObservacoes retorna lista", async () => {
    const lista = [{ id: "1", texto: "Teste" }];

    Observacao.find.mockResolvedValue(lista);

    const result = await servico.listarObservacoes(1);

    expect(result).toEqual(lista);
  });

  test("processarEvento atualiza quando recebe ObservacaoClassificada", async () => {
    const obs = { id: "x", status: "aguardando", save: jest.fn() };

    Observacao.findOne.mockResolvedValue(obs);

    await servico.processarEvento("ObservacaoClassificada", {
      id: "x",
      status: "feito"
    });

    expect(obs.status).toBe("feito");
    expect(obs.save).toHaveBeenCalled();
  });

  test("evento desconhecido é ignorado", async () => {
    await servico.processarEvento("NadaAqui", {});
    expect(enviarEvento).not.toHaveBeenCalled();
  });

});
