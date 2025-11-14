const request = require("supertest");
const express = require("express");

// mock do axios (importantíssimo)
jest.mock("axios");
const axios = require("axios");

// importa rotas e serviço
const rotas = require("../barramento-de-eventos/src/routes");
const { listarEventos, _eventosInternos } = require("../barramento-de-eventos/src/servicoBarramento");


let app;

beforeEach(() => {
  jest.clearAllMocks();

  app = express();
  app.use(express.json());
  app.use(rotas);
});

describe("Barramento de Eventos", () => {

  test("deve retornar 400 ao enviar evento sem tipo", async () => {
    const res = await request(app)
      .post("/eventos")
      .send({ foo: "bar" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("erro");
  });

  test("deve aceitar evento válido e repassar para os serviços", async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const evento = { tipo: "TesteCriado", dados: { msg: "oi" } };

    const res = await request(app)
      .post("/eventos")
      .send(evento);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ msg: "ok" });

    // barramento envia para 4 serviços
    expect(axios.post).toHaveBeenCalledTimes(4);
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:4000/eventos",
      evento,
      expect.any(Object)
    );
  });

  test("deve armazenar eventos localmente", async () => {
    const evento = { tipo: "TesteLocal", dados: {} };

    await request(app).post("/eventos").send(evento);

    const res = await request(app).get("/eventos");

    expect(res.status).toBe(200);

    const lista = res.body;
    expect(Array.isArray(lista)).toBe(true);
    expect(lista.some(ev => ev.tipo === "TesteLocal")).toBe(true);
  });

  test("não deve quebrar se axios lançar erro", async () => {
    axios.post.mockRejectedValue(new Error("Falha na requisição"));

    const evento = { tipo: "ErroSimulado" };
    const res = await request(app).post("/eventos").send(evento);

    expect(res.status).toBe(200); // barramento nunca cai
    expect(axios.post).toHaveBeenCalledTimes(4);
  });
});