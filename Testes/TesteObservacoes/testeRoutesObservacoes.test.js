const request = require("supertest");
const express = require("express");
const routes = require("../../observacoes/src/routes");
const { criarObservacao, listarObservacoes, processarEvento } = require("../../observacoes/src/servicoObservacoes");

jest.mock("../../observacoes/src/servicoObservacoes");

const app = express();
app.use(express.json());
app.use(routes);

describe("Rotas de Observações", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("PUT /lembretes/:id/observacoes cria uma observação", async () => {
    const fakeObs = { id: "1", texto: "Teste", lembreteId: 10, status: "aguardando" };
    criarObservacao.mockResolvedValue(fakeObs);

    const res = await request(app)
      .put("/lembretes/10/observacoes")
      .send({ texto: "Teste" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(fakeObs);
    expect(criarObservacao).toHaveBeenCalledWith("10", "Teste");
  });

  test("PUT /lembretes/:id/observacoes retorna erro se não enviar texto", async () => {
    const res = await request(app)
      .put("/lembretes/10/observacoes")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ erro: "O campo 'texto' é obrigatório." });
  });

  test("GET /lembretes/:id/observacoes retorna lista", async () => {
    const fakeList = [{ id: "1", texto: "Oi", lembreteId: 10 }];
    listarObservacoes.mockResolvedValue(fakeList);

    const res = await request(app).get("/lembretes/10/observacoes");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeList);
    expect(listarObservacoes).toHaveBeenCalledWith("10");
  });

  test("POST /eventos processa evento corretamente", async () => {
    const evento = { tipo: "ObservacaoClassificada", dados: { id: "1" } };

    const res = await request(app).post("/eventos").send(evento);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ msg: "ok" });
    expect(processarEvento).toHaveBeenCalledWith("ObservacaoClassificada", { id: "1" });
  });

  test("POST /eventos retorna erro se tipo faltar", async () => {
    const res = await request(app).post("/eventos").send({ dados: {} });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ erro: "Evento sem tipo" });
  });
});