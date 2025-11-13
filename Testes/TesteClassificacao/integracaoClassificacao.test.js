// Testes/TesteClassificacao/integracaoClassificacao.test.js
const request = require("supertest");
const app = require("../../classificacao/src/server");
const { enviarEvento } = require("../../classificacao/src/distribuidorEventos");

jest.mock("../../classificacao/src/distribuidorEventos", () => ({
  enviarEvento: jest.fn(),
}));

describe("Integração - Serviço Classificação", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Fluxo completo de classificação de Lembrete", async () => {
    const evento = { tipo: "LembreteCriado", dados: { texto: "tarefa importante" } };
    const res = await request(app).post("/eventos").send(evento);

    expect(res.statusCode).toBe(200);
    expect(enviarEvento).toHaveBeenCalledWith("LembreteClassificado", {
      texto: "tarefa importante",
      status: "importante",
    });
  });

  test("Fluxo completo de classificação de Observação", async () => {
    const evento = { tipo: "ObservacaoCriada", dados: { texto: "anotação comum" } };
    const res = await request(app).post("/eventos").send(evento);

    expect(res.statusCode).toBe(200);
    expect(enviarEvento).toHaveBeenCalledWith("ObservacaoClassificada", {
      texto: "anotação comum",
      status: "comum",
    });
  });
});
