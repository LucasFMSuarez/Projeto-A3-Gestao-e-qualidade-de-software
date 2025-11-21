const { criarLembrete, listarLembretes, processarEvento } = require("../../lembretes/src/servicoLembretes");
const Lembrete = require("../../banco/lembreteModel");
const { enviarEvento } = require("../../lembretes/src/distribuidorEventos");

// Mock dos eventos
jest.mock("../../lembretes/src/distribuidorEventos", () => ({
  enviarEvento: jest.fn()
}));

// Mock do model Lembrete
jest.mock("../../banco/lembreteModel", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(() => ({
    sort: jest.fn(() => ({
      lean: jest.fn().mockResolvedValue(null)
    }))
  }))
}));

describe("Serviço de Lembretes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("criarLembrete cria um lembrete e envia evento", async () => {
    const fake = { id: 1, texto: "Teste", status: "aguardando" };
    Lembrete.create.mockResolvedValue(fake);

    const result = await criarLembrete("Teste");

    expect(Lembrete.create).toHaveBeenCalledWith(fake);
    expect(enviarEvento).toHaveBeenCalledWith("LembreteCriado", fake);
    expect(result).toEqual(fake);
  });

  test("listarLembretes retorna lista", async () => {
    const lista = [{ id: 1, texto: "Teste" }];
    Lembrete.find.mockResolvedValue(lista);

    expect(await listarLembretes()).toEqual(lista);
  });

  test("processarEvento atualiza e reenviar evento", async () => {
    const lembrete = { id: 1, texto: "Teste", status: "aguardando", save: jest.fn() };
    Lembrete.findOne.mockResolvedValue(lembrete);

    await processarEvento("LembreteClassificado", { id: 1, status: "feito" });

    expect(lembrete.status).toBe("feito");
    expect(lembrete.save).toHaveBeenCalled();

    expect(enviarEvento).toHaveBeenCalledWith("LembreteAtualizado", {
      id: 1,
      texto: "Teste",
      status: "feito"
    });
  });
});
