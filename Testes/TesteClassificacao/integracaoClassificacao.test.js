// Testes/TesteClassificacao/integracaoClassificacao.test.js
const request = require("supertest");
const app = require("../../classificacao/src/server");

jest.mock("axios", () => ({
  post: jest.fn().mockResolvedValue({ status: 200 })
}));

const axios = require("axios");

describe("Integração REAL - Serviço de Classificação", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Classifica LembreteCriado e envia evento correto", async () => {
    const evento = {
      tipo: "LembreteCriado",
      dados: { texto: "algo muito importante" }
    };

    const res = await request(app).post("/eventos").send(evento);

    expect(res.statusCode).toBe(200);

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:10000/eventos",
      {
        tipo: "LembreteClassificado",
        dados: { texto: "algo muito importante", status: "importante" }
      }
    );
  });

  test("Classifica ObservacaoCriada e envia evento correto", async () => {
    const evento = {
      tipo: "ObservacaoCriada",
      dados: { texto: "teste comum" }
    };

    const res = await request(app).post("/eventos").send(evento);

    expect(res.statusCode).toBe(200);

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:10000/eventos",
      {
        tipo: "ObservacaoClassificada",
        dados: { texto: "teste comum", status: "comum" }
      }
    );
  });
});
