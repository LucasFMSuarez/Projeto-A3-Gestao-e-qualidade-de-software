// testeRoutes.test.js

const request = require('supertest');
const express = require('express');
const routes = require('../../observacoes/src/routes');

const axios = require('axios');
jest.mock('axios'); // evita chamadas reais

const app = express();
app.use(express.json());
app.use('/', routes);

describe('Rotas de Observações', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve criar uma nova observação para um lembrete', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const resposta = await request(app)
      .put('/lembretes/123/observacoes')
      .send({ texto: 'Teste rota observações' })
      .expect(201);

    expect(resposta.body[0]).toHaveProperty('id');
    expect(resposta.body[0]).toHaveProperty('status', 'aguardando');
    expect(axios.post).toHaveBeenCalled();
  });

  test('Deve retornar lista de observações de um lembrete', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    await request(app).put('/lembretes/123/observacoes').send({ texto: 'Obs 1' });
    const resposta = await request(app).get('/lembretes/123/observacoes').expect(200);

    expect(Array.isArray(resposta.body)).toBe(true);
    expect(resposta.body.length).toBeGreaterThan(0);
  });
});
