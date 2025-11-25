const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../../lembretes/src/server");
const Lembrete = require("../../banco/lembreteModel");

// Mock do axios para impedir chamadas externas durante o teste
jest.mock("axios", () => ({
  post: jest.fn().mockResolvedValue({ status: 200 })
}));

jest.setTimeout(10000);

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

describe("Integração Lembretes (REAL)", () => {
  it("cria e lista lembretes", async () => {
    const texto = "Teste integração";

    const createRes = await request(app)
      .put("/lembretes")
      .send({ texto });

    expect(createRes.status).toBe(201);
    expect(createRes.body.texto).toBe(texto);

    const listRes = await request(app).get("/lembretes");

    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(1);
    expect(listRes.body[0].texto).toBe(texto);
  });

  it("processa evento de classificação", async () => {
    const createRes = await request(app)
      .put("/lembretes")
      .send({ texto: "Teste evento" });

    const lembrete = createRes.body;

    const evento = {
      tipo: "LembreteClassificado",
      dados: { id: lembrete.id, status: "feito" }
    };

    const resEvento = await request(app).post("/eventos").send(evento);

    expect(resEvento.status).toBe(200);

    const atualizado = await Lembrete.findOne({ id: lembrete.id });
    expect(atualizado.status).toBe("feito");
  });
});
