const { criarLembrete, listarLembretes, processarEvento } = require("../../lembretes/src/servicoLembretes");
const Lembrete = require("../../banco/lembreteModel");
const { enviarEvento } = require("../../lembretes/src/distribuidorEventos");

jest.mock("../../lembretes/src/distribuidorEventos", () => ({
  enviarEvento: jest.fn()
}));

jest.mock("../../banco/lembreteModel", () => ({
  findOne: jest.fn(() => ({
    sort: jest.fn(() => ({ lean: jest.fn().mockResolvedValue(null) }))
  })),
  create: jest.fn(),
  find: jest.fn()
}));

describe("Serviço de Lembretes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("criarLembrete cria um lembrete e envia evento", async () => {
    const fakeLembrete = { id: 1, texto: "Teste", status: "aguardando" };
    Lembrete.create.mockResolvedValue(fakeLembrete);

    const result = await criarLembrete("Teste");

    expect(Lembrete.create).toHaveBeenCalledWith({
      id: 1,
      texto: "Teste",
      status: "aguardando"
    });

    // Ajustado para o formato enviarEvento(tipo, dados)
    expect(enviarEvento).toHaveBeenCalledWith(
      "LembreteCriado",
      fakeLembrete
    );

    expect(result).toEqual(fakeLembrete);
  });

  test("listarLembretes retorna lista", async () => {
    const fakeList = [{ id: 1, texto: "Teste" }];
    Lembrete.find.mockResolvedValue(fakeList);

    const result = await listarLembretes();
    expect(result).toEqual(fakeList);
  });

  test("processarEvento atualiza status quando recebe LembreteClassificado", async () => {
    const lembrete = { id: 1, texto: "Teste", status: "aguardando", save: jest.fn() };
    Lembrete.findOne.mockResolvedValue(lembrete);

    await processarEvento("LembreteClassificado", { id: 1, status: "feito" });

    expect(lembrete.status).toBe("feito");
    expect(lembrete.save).toHaveBeenCalled();

    // Também ajustado para o formato enviarEvento(tipo, dados)
    expect(enviarEvento).toHaveBeenCalledWith(
      "LembreteAtualizado",
      { id: 1, texto: "Teste", status: "feito" }
    );
  });
});