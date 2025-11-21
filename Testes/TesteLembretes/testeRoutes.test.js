jest.mock("../../lembretes/src/servicoLembretes", () => ({
  criarLembrete: jest.fn(),
  listarLembretes: jest.fn(),
  processarEvento: jest.fn()
}));

// só depois de mockar:
const servico = require("../../lembretes/src/servicoLembretes");
const request = require("supertest");
const app = require("../../lembretes/src/server");

describe("Rotas de Lembretes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("GET /lembretes retorna lista", async () => {
    const lista = [{ id: 1, texto: "Teste" }];
    servico.listarLembretes.mockResolvedValue(lista);

    const res = await request(app).get("/lembretes");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(lista);
  });

  test("PUT /lembretes cria lembrete", async () => {
    const fake = { id: 1, texto: "Novo" };
    servico.criarLembrete.mockResolvedValue(fake);

    const res = await request(app).put("/lembretes").send({ texto: "Novo" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(fake);
    expect(servico.criarLembrete).toHaveBeenCalledWith("Novo", undefined);
  });

  test("POST /eventos processa evento", async () => {
    const evento = { tipo: "LembreteClassificado", dados: { id: 1, status: "feito" } };

    const res = await request(app).post("/eventos").send(evento);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ msg: "ok" });
    expect(servico.processarEvento).toHaveBeenCalledWith(evento.tipo, evento.dados);
  });
});
