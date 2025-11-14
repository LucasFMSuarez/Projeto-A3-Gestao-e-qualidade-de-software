const { listarLembretesComObservacoes } = require("../../consulta/src/servicoConsulta");

const Lembrete = require("../../banco/lembreteModel");
const Observacao = require("../../banco/observacaoModel");

jest.mock("../../banco/lembreteModel");
jest.mock("../../banco/observacaoModel");

describe("Service - listarLembretesComObservacoes", () => {

  test("deve retornar lembretes com suas observações", async () => {

    Lembrete.find.mockResolvedValue([
      { id: "1", texto: "L1", status: "pendente" }
    ]);

    Observacao.find.mockResolvedValue([
      { id: "100", texto: "Obs", status: "ok", lembreteId: "1" }
    ]);

    const resultado = await listarLembretesComObservacoes();

    expect(resultado).toEqual({
      "1": {
        id: "1",
        texto: "L1",
        status: "pendente",
        observacoes: [
          { id: "100", texto: "Obs", status: "ok", lembreteId: "1" }
        ]
      }
    });
  });
});