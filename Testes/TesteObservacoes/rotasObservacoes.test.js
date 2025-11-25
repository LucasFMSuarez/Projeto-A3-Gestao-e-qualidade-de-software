// Testes/TesteObservacoes/rotasObservacoes.test.js
const request = require("supertest");
const express = require("express");
const routes = require("../../observacoes/src/routes");
const { criarObservacao, listarObservacoes, processarEvento } = require("../../observacoes/src/servicoObservacoes");

jest.mock("../../observacoes/src/servicoObservacoes");

const app = express();
app.use(express.json());
app.use(routes);

describe("Rotas Observações", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("PUT /lembretes/:id/observacoes deve criar observação", async () => {
    criarObservacao.mockResolvedValue({ id: "id1", texto: "Teste rota", status: "comum", lembreteId: "l1" });

    const res = await request(app)
      .put("/lembretes/l1/observacoes")
      .send({ texto: "Teste rota", status: "comum" })
      .expect(201);

    expect(res.body).toHaveProperty("id", "id1");
    expect(criarObservacao).toHaveBeenCalledWith("l1", "Teste rota", "comum");
  });

  test("GET /lembretes/:id/observacoes deve listar observações", async () => {
    listarObservacoes.mockResolvedValue([{ id: "id1", texto: "Obs teste" }]);

    const res = await request(app)
      .get("/lembretes/l1/observacoes")
      .expect(200);

    expect(res.body).toHaveLength(1);
    expect(res.body[0].texto).toBe("Obs teste");
  });

  test("POST /eventos deve processar evento ObservacaoClassificada", async () => {
    processarEvento.mockResolvedValue();

    await request(app)
      .post("/eventos")
      .send({ tipo: "ObservacaoClassificada", dados: { id: "id1", status: "importante" } })
      .expect(200);

    expect(processarEvento).toHaveBeenCalledWith("ObservacaoClassificada", { id: "id1", status: "importante" });
  });
});
