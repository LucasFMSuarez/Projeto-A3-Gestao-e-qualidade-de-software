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
    axios.post.mockResolvedValue({ status: 200 });
  });

  test('Deve criar uma nova observação para um lembrete', async () => {
    const resposta = await request(app)
      .put('/lembretes/123/observacoes')
      .send({ texto: 'Teste rota observações' })
      .expect(201);

    expect(resposta.body[0]).toHaveProperty('id');
    expect(resposta.body[0]).toHaveProperty('status', 'aguardando');

    // Ajuste: verifica que axios.post foi chamado com objeto completo
    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        tipo: 'ObservacaoCriada',
        dados: expect.objectContaining({
          id: expect.any(String),
          texto: 'Teste rota observações',
          lembreteId: '123',
          status: 'aguardando'
        })
      })
    );
  });

  test('Deve retornar lista de observações de um lembrete', async () => {
    await request(app).put('/lembretes/123/observacoes').send({ texto: 'Obs 1' });
    const resposta = await request(app).get('/lembretes/123/observacoes').expect(200);

    expect(Array.isArray(resposta.body)).toBe(true);
    expect(resposta.body.length).toBeGreaterThan(0);
  });
});
