const request = require("supertest");
const app = require('../../lembretes/src/server');
const { enviarEvento } = require('../../lembretes/src/distribuidorEventos')

jest.mock('../../lembretes/src/distribuidorEventos')

describe("Testes das rotas", () => {
  beforeEach(() => {
    enviarEvento.mockClear();
  });

  test("GET /lembretes deve retornar lista", async () => {
    const res = await request(app).get("/lembretes");

    expect(res.status).toBe(200);
    expect(typeof res.body).toBe("object");
  });

  test("PUT /lembretes deve criar e retornar lembrete", async () => {
    enviarEvento.mockResolvedValueOnce();

    const res = await request(app)
      .put("/lembretes")
      .send({ texto: "Comprar pão" });

    expect(res.status).toBe(201);
    expect(res.body.texto).toBe("Comprar pão");

    expect(enviarEvento).toHaveBeenCalled();
  });

  test("POST /eventos deve responder OK", async () => {
    const res = await request(app)
      .post("/eventos")
      .send({ msg: "Teste" });

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("ok");
  });
});