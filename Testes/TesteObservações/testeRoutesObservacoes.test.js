const request = require("supertest");
const express = require("express");
const routes = require("../../observacoes/src/routes");
const servico = require("../../observacoes/src/servicoObservacoes");

jest.mock("../../observacoes/src/servicoObservacoes");

const app = express();
app.use(express.json());
app.use(routes);

describe("Testes das rotas de Observações", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Criar observação (PUT)", async () => {
    const fake = { id: "1", texto: "Teste", lembreteId: 10, status: "aguardando" };
    servico.criarObservacao.mockResolvedValue(fake);

    const res = await request(app)
      .put("/lembretes/10/observacoes")
      .send({ texto: "Teste" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(fake);
  });

  test("Criar observação sem texto retorna erro", async () => {
    const res = await request(app)
      .put("/lembretes/10/observacoes")
      .send({});

    expect(res.status).toBe(400);
  });

  test("Listar observações (GET)", async () => {
    const lista = [{ id: "1", texto: "Funcionou o teste" }];
    servico.listarObservacoes.mockResolvedValue(lista);

    const res = await request(app).get("/lembretes/10/observacoes");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(lista);
  });

  test("Receber evento (POST)", async () => {
    const evento = { tipo: "ObservacaoClassificada", dados: { id: "1" } };

    const res = await request(app).post("/eventos").send(evento);

    expect(res.status).toBe(200);
    expect(servico.processarEvento).toHaveBeenCalled();
  });

  test("Evento sem tipo dá erro", async () => {
    const res = await request(app).post("/eventos").send({ dados: {} });

    expect(res.status).toBe(400);
  });

});
