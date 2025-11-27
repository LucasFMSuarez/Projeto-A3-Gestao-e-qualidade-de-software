const request = require("supertest");
const app = require("../../consulta/src/app");
const { processarEvento } = require("../../consulta/src/funcoesEventos");
const { listarLembretesComObservacoes } = require("../../consulta/src/servicoConsulta");

jest.mock("../../consulta/src/funcoesEventos");
jest.mock("../../consulta/src/servicoConsulta");
const routes = require("../../consulta/src/routes");

describe("Rotas do serviço Consulta", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /lembretes deve retornar a lista do service", async () => {
    const fakeData = {
      "1": { id: "1", texto: "Teste", status: "pendente", observacoes: [] }
    };

    listarLembretesComObservacoes.mockResolvedValue(fakeData);

    const resposta = await request(app).get("/lembretes");

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual(fakeData);
    expect(listarLembretesComObservacoes).toHaveBeenCalledTimes(1);
  });

  test("POST /eventos deve chamar processarEvento", async () => {
    const evento = {
      tipo: "LembreteCriado",
      dados: { id: "1", texto: "abc" }
    };

    const resposta = await request(app)
      .post("/eventos")
      .send(evento);

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual({ msg: "ok" });
    expect(processarEvento).toHaveBeenCalledWith("LembreteCriado", evento.dados);
  });

  test("POST /eventos deve retornar ok mesmo com erro", async () => {
    processarEvento.mockRejectedValue(new Error("falhou"));

    const resposta = await request(app)
      .post("/eventos")
      .send({ tipo: "x", dados: {} });

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual({ msg: "ok" });
  });
});