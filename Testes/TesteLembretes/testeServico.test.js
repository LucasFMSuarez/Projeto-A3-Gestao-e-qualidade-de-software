const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Lembrete = require("../../banco/lembreteModel");
const {
  criarLembrete,
  listarLembretes,
  processarEvento
} = require("../../lembretes/src/servicoLembretes");

// Mock das requisições externas
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

describe("Serviço REAL de Lembretes", () => {
  test("criarLembrete cria no banco e envia evento REAL", async () => {
    const result = await criarLembrete("Teste real");

    const salvo = await Lembrete.findOne({ id: result.id });

    expect(salvo).not.toBeNull();
    expect(salvo.texto).toBe("Teste real");
  });

  test("listarLembretes retorna lista REAL", async () => {
    await Lembrete.create({ id: 50, texto: "AAA", status: "aguardando" });

    const lista = await listarLembretes();

    expect(lista.length).toBe(1);
    expect(lista[0].texto).toBe("AAA");
  });

  test("processarEvento atualiza lembrete REAL", async () => {
    await Lembrete.create({ id: 10, texto: "ZZZ", status: "aguardando" });

    await processarEvento("LembreteClassificado", {
      id: 10,
      status: "feito"
    });

    const atualizado = await Lembrete.findOne({ id: 10 });
    expect(atualizado.status).toBe("feito");
  });
});
