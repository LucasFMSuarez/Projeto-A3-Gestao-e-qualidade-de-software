const { criarLembrete, listarLembretes } = require('../../lembretes/src/servicoLembretes');
const { enviarEvento } = require('../../lembretes/src/distribuidorEventos')

jest.mock('../../lembretes/src/distribuidorEventos')

describe("Serviço de Lembretes", () => {
  beforeEach(() => {
    enviarEvento.mockClear();
  });

  test("criarLembrete deve criar um lembrete e chamar enviarEvento", async () => {
    enviarEvento.mockResolvedValueOnce();

    const resultado = await criarLembrete("Estudar Node");

    expect(resultado).toEqual({ contador: 1, texto: "Estudar Node" });

    expect(enviarEvento).toHaveBeenCalledWith("LembreteCriado", {
      contador: 1,
      texto: "Estudar Node",
    });
  });

  test("listarLembretes deve retornar os existentes", async () => {
    const todos = listarLembretes();
    expect(todos[1]).toEqual({ contador: 1, texto: "Estudar Node" });
  });
});