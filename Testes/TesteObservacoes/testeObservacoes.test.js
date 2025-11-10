// testeObservacoes.test.js

const request = require('supertest');
const express = require('express');
const routes = require('../../observacoes/src/routes');
const { observacoesPorLembreteId } = require('../../observacoes/src/servicoObservacoes');

const axios = require('axios');
jest.mock('axios'); 
axios.post.mockResolvedValue({ status: 200 }); // garante que não dá erro

const app = express();
app.use(express.json());
app.use('/', routes);

describe('Integração Observações', () => {

  // Limpa todas as observações antes de cada teste
  beforeEach(() => {
    for (const key in observacoesPorLembreteId) delete observacoesPorLembreteId[key];
  });

  test('Deve criar e processar ObservacaoClassificada sem erro', async () => {
    // 1Cria a observação
    const criar = await request(app)
      .put('/lembretes/123/observacoes')
      .send({ texto: 'Observação inicial' })
      .expect(201);

    const idObs = criar.body[0].id;

    // 2Processa evento de classificação
    const evento = {
      tipo: 'ObservacaoClassificada',
      dados: {
        id: idObs,
        texto: 'Observação inicial',
        lembreteId: '123',
        status: 'aprovada'
      }
    };

    const resposta = await request(app).post('/eventos').send(evento);
    expect(resposta.statusCode).toBe(200);
    expect(resposta.body).toHaveProperty('msg', 'ok');
    expect(axios.post).toHaveBeenCalled();
  });

  test('Deve listar observações existentes', async () => {
    await request(app).put('/lembretes/123/observacoes').send({ texto: 'Teste listar' });

    const lista = await request(app).get('/lembretes/123/observacoes').expect(200);
    expect(lista.body.length).toBe(1);
    expect(lista.body[0].texto).toBe('Teste listar');
  });
});
