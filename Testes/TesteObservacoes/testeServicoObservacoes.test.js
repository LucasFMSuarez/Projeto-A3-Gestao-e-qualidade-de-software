// Testes/TesteObservacao/testeServicoObservacoes.test.js
const { criarObservacao, listarObservacoes } = require("../../observacoes/src/servicoObservacoes");
const Observacao = require("../../banco/ObservacaoModel");
const { enviarEvento } = require("../../observacoes/src/distribuidorEventos");
const { v4: uuidv4 } = require("uuid");

// MOCKs
jest.mock("../../banco/ObservacaoModel");
jest.mock("../../observacoes/src/distribuidorEventos");
jest.mock("uuid");

describe("Serviço de Observações", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //testa a criação de observações

  test("criarObservacao deve criar e retornar uma observação", async () => {
    uuidv4.mockReturnValue("id-fixo");
    Observacao.create.mockResolvedValue({ id: "id-fixo", texto: "Obs teste", lembreteId: "l1", status: "comum" });

    const obs = await criarObservacao("l1", "Obs teste", "comum");

    expect(obs).toHaveProperty("id", "id-fixo");
    expect(enviarEvento).toHaveBeenCalledWith("ObservacaoCriada", expect.objectContaining({
      id: "id-fixo",
      texto: "Obs teste",
      lembreteId: "l1",
      status: "comum"
    }));
  });

  test("listarObservacoes deve retornar observações de um lembrete", async () => {
    Observacao.find.mockResolvedValue([
      { id: "1", texto: "Obs1", lembreteId: "l1", status: "comum" },
      { id: "2", texto: "Obs2", lembreteId: "l1", status: "comum" }
    ]);

    const lista = await listarObservacoes("l1");
    expect(lista).toHaveLength(2);
    expect(lista.map(o => o.texto)).toEqual(expect.arrayContaining(["Obs1", "Obs2"]));
  });
});
