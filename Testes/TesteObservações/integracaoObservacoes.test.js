const Observacao = require("../../banco/ObservacaoModel");
const servico = require("../../observacoes/src/servicoObservacoes");
const { enviarEvento } = require("../../observacoes/src/distribuidorEventos");

jest.mock("../../banco/ObservacaoModel");
jest.mock("../../observacoes/src/distribuidorEventos", () => ({
  enviarEvento: jest.fn()
}));

describe("Testes simples de Observações", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Criar, atualizar e listar observação", async () => {
    const fake = {
      id: "1",
      texto: "Teste",
      lembreteId: "100",
      status: "aguardando",
      save: jest.fn()
    };

    // Finjindo as funções basicas 
    Observacao.create.mockResolvedValue(fake);
    Observacao.findOne.mockResolvedValue(fake);
    Observacao.find.mockResolvedValue([fake]);

    // criar
    const criada = await servico.criarObservacao("100", "Teste");
    expect(criada).toBe(fake);
    expect(enviarEvento).toHaveBeenCalled();

    // atualizar
    await servico.processarEvento("ObservacaoClassificada", {
      id: "1",
      status: "feito"
    });

    expect(fake.status).toBe("feito");
    expect(fake.save).toHaveBeenCalled();

    // listar
    const lista = await servico.listarObservacoes("100");
    expect(lista).toEqual([fake]);
  });

  test("Evento desconhecido não faz nada", async () => {
    await servico.processarEvento("QualquerCoisa", {});
    expect(enviarEvento).not.toHaveBeenCalled();
  });

});
