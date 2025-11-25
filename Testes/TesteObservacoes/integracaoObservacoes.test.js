// Testes/TesteObservacoes/integracaoObservacoes.test.js
const { criarObservacao, listarObservacoes } = require("../../observacoes/src/servicoObservacoes");
const Observacao = require("../../banco/ObservacaoModel");
const { enviarEvento } = require("../../observacoes/src/distribuidorEventos");
const { v4: uuidv4 } = require("uuid");

jest.mock("../../banco/ObservacaoModel");
jest.mock("../../observacoes/src/distribuidorEventos");
jest.mock("uuid");

describe("Integração Observações", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Observacao.create.mockReset();
    Observacao.find.mockReset();
  });

  test("criarObservacao e listarObservacoes devem funcionar juntos", async () => {
    uuidv4.mockReturnValueOnce("id1").mockReturnValueOnce("id2");

    const dadosCriados = [
      { id: "id1", texto: "Obs integração 1", lembreteId: "l1", status: "comum" },
      { id: "id2", texto: "Obs integração 2", lembreteId: "l1", status: "comum" }
    ];

    Observacao.create
      .mockResolvedValueOnce(dadosCriados[0])
      .mockResolvedValueOnce(dadosCriados[1]);

    Observacao.find.mockResolvedValue(dadosCriados);

    await criarObservacao("l1", "Obs integração 1");
    await criarObservacao("l1", "Obs integração 2");

    const lista = await listarObservacoes("l1");
    expect(lista).toHaveLength(2);
    expect(lista.map(o => o.texto)).toEqual(expect.arrayContaining(["Obs integração 1", "Obs integração 2"]));
  });
});
