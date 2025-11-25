/**
 * Teste REAL das rotas de lembretes
 */
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../../lembretes/src/server");
const Lembrete = require("../../banco/lembreteModel");

// Mock apenas das requisições externas (eventos -> barramento)
jest.mock("axios", () => ({
  post: jest.fn().mockResolvedValue({ status: 200 })
}));

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "testdb" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Lembrete.deleteMany();
});

describe("Rotas reais de Lembretes", () => {
  test("GET /lembretes retorna lista REAL", async () => {
    await Lembrete.create({ id: 1, texto: "Teste", status: "aguardando" });

    const res = await request(app).get("/lembretes");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].texto).toBe("Teste");
  });

  test("PUT /lembretes cria lembrete REAL", async () => {
    const res = await request(app)
      .put("/lembretes")
      .send({ texto: "Novo lembrete" });

    expect(res.status).toBe(201);
    expect(res.body.texto).toBe("Novo lembrete");

    const saved = await Lembrete.findOne({ id: res.body.id });
    expect(saved).not.toBeNull();
  });

  test("POST /eventos processa evento REAL", async () => {
    const criado = await request(app)
      .put("/lembretes")
      .send({ texto: "Teste evento" });

    const evento = {
      tipo: "LembreteClassificado",
      dados: { id: criado.body.id, status: "feito" }
    };

    const res = await request(app).post("/eventos").send(evento);

    expect(res.status).toBe(200);

    const atualizado = await Lembrete.findOne({ id: criado.body.id });
    expect(atualizado.status).toBe("feito");
  });
});
