// Testes/TesteClassificacao/testeRoutesClassificacao.test.js
const request = require("supertest");
const app = require("../../classificacao/src/server");
const servico = require("../../classificacao/src/servicoClassificacao");

jest.mock("../../classificacao/src/servicoClassificacao", () => ({
  processarEvento: jest.fn(),
}));

describe("Rotas - Classificação (/eventos)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Chama processarEvento com tipo e dados", async () => {
    const evento = { tipo: "LembreteCriado", dados: { texto: "teste" } };

    const res = await request(app).post("/eventos").send(evento);

    expect(servico.processarEvento).toHaveBeenCalledWith(
      "LembreteCriado",
      { texto: "teste" }
    );
    expect(res.statusCode).toBe(200);
  });

  test("Retorna 400 quando não há tipo", async () => {
    const res = await request(app).post("/eventos").send({ dados: {} });
    expect(res.statusCode).toBe(400);
  });

  test("Aceita formato alternativo (req.body.tipo.tipo)", async () => {
    const evento = { tipo: { tipo: "ObservacaoCriada", dados: { texto: "A" } } };

    const res = await request(app).post("/eventos").send(evento);

    expect(servico.processarEvento).toHaveBeenCalledWith(
      "ObservacaoCriada",
      { texto: "A" }
    );
    expect(res.statusCode).toBe(200);
  });

  test("Retorna 500 em erro interno", async () => {
    servico.processarEvento.mockImplementationOnce(() => {
      throw new Error("Falha");
    });

    const evento = { tipo: "LembreteCriado", dados: { texto: "B" } };

    const res = await request(app).post("/eventos").send(evento);

    expect(res.statusCode).toBe(500);
  });
});
