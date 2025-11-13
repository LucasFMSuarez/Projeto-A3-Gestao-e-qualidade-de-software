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

  test("Deve chamar processarEvento corretamente com tipo e dados", async () => {
    const evento = { tipo: "LembreteCriado", dados: { texto: "importante" } };
    const res = await request(app).post("/eventos").send(evento);

    expect(servico.processarEvento).toHaveBeenCalledWith("LembreteCriado", {
      texto: "importante",
    });
    expect(res.statusCode).toBe(200);
  });

  test("Deve retornar 400 se tipo estiver ausente", async () => {
    const res = await request(app).post("/eventos").send({ dados: {} });
    expect(res.statusCode).toBe(400);
  });

  test("Deve aceitar formato alternativo de evento (req.body.tipo.tipo)", async () => {
    const evento = {
      tipo: { tipo: "ObservacaoCriada", dados: { texto: "teste" } },
    };
    const res = await request(app).post("/eventos").send(evento);
    expect(servico.processarEvento).toHaveBeenCalledWith(
      "ObservacaoCriada",
      { texto: "teste" }
    );
    expect(res.statusCode).toBe(200);
  });

  test("Deve retornar 500 em caso de erro no processamento", async () => {
    servico.processarEvento.mockImplementationOnce(() => {
      throw new Error("Falha simulada");
    });
    const evento = { tipo: "LembreteCriado", dados: { texto: "teste" } };
    const res = await request(app).post("/eventos").send(evento);
    expect(res.statusCode).toBe(500);
  });
});
