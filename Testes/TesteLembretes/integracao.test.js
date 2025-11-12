const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../../lembretes/src/server");
const Lembrete = require("../../banco/lembreteModel");

jest.setTimeout(10000); // aumenta timeout para o MongoMemoryServer

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
  await Lembrete.deleteMany(); // limpa dados entre testes
});

describe("Integração Lembretes", () => {
  it("cria e lista lembretes", async () => {
    // Cria lembrete
    const texto = "Teste integração";
    const createRes = await request(app)
      .put("/lembretes")
      .send({ texto });

    expect(createRes.status).toBe(201);
    expect(createRes.body.texto).toBe(texto);

    // Lista lembretes
    const listRes = await request(app).get("/lembretes");
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(1);
    expect(listRes.body[0].texto).toBe(texto);
  });

  it("processa evento de classificação", async () => {
    // Cria lembrete
    const createRes = await request(app)
      .put("/lembretes")
      .send({ texto: "Teste evento" });

    const lembrete = createRes.body;

    // Simula evento do barramento
    const evento = { tipo: "LembreteClassificado", dados: { id: lembrete.id, status: "feito" } };
    const resEvento = await request(app).post("/eventos").send(evento);

    expect(resEvento.status).toBe(200);

    // Confere no banco
    const atualizado = await Lembrete.findOne({ id: lembrete.id });
    expect(atualizado.status).toBe("feito");
  });
});
