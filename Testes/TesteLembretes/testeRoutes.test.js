const request = require("supertest");
const app = require("../../lembretes/src/server");
const servicoLembretes = require("../../lembretes/src/servicoLembretes");

jest.mock("../../lembretes/src/servicoLembretes", () => ({
  criarLembrete: jest.fn(),
  listarLembretes: jest.fn(),
  processarEvento: jest.fn()
}));

describe("Rotas de Lembretes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /lembretes", () => {
    it("deve retornar lista de lembretes", async () => {
      const fakeList = [{ id: 1, texto: "Teste" }];
      servicoLembretes.listarLembretes.mockResolvedValue(fakeList);

      const res = await request(app).get("/lembretes");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(fakeList);
    });
  });

  describe("PUT /lembretes", () => {
    it("deve criar um novo lembrete", async () => {
      const fakeLembrete = { id: 1, texto: "Novo" };
      servicoLembretes.criarLembrete.mockResolvedValue(fakeLembrete);

      const res = await request(app)
        .put("/lembretes")
        .send({ texto: "Novo" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(fakeLembrete);
      expect(servicoLembretes.criarLembrete).toHaveBeenCalledWith("Novo");
    });
  });

  describe("POST /eventos", () => {
    it("deve processar um evento recebido", async () => {
      const evento = { tipo: "LembreteClassificado", dados: { id: 1, status: "feito" } };

      const res = await request(app)
        .post("/eventos")
        .send(evento);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ msg: "ok" });
      expect(servicoLembretes.processarEvento).toHaveBeenCalledWith(evento.tipo, evento.dados);
    });
  });
});