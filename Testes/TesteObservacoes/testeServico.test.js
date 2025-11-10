// testeServico.test.js
const axios = require('axios');
jest.mock('axios'); // evita chamadas HTTP reais

const {
  processarEvento,
  observacoesPorLembreteId,
  criarObservacao,
  listarObservacoes
} = require('../../observacoes/src/servicoObservacoes');

describe('Serviço de Observações', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key in observacoesPorLembreteId) delete observacoesPorLembreteId[key];
  });

  test('Deve atualizar status de observação ao processar ObservacaoClassificada', async () => {
    observacoesPorLembreteId['1'] = [{ id: 'abc', texto: 'teste', status: 'aguardando' }];

    axios.post.mockResolvedValue({ status: 200 });

    await processarEvento('ObservacaoClassificada', {
      id: 'abc',
      texto: 'teste',
      lembreteId: '1',
      status: 'aprovada'
    });

    expect(observacoesPorLembreteId['1'][0].status).toBe('aprovada');
    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        tipo: 'ObservacaoAtualizada',
        dados: expect.objectContaining({
          id: 'abc',
          texto: 'teste',
          lembreteId: '1',
          status: 'aprovada'
        })
      })
    );
  });

  test('Deve criar uma observação nova', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const obs = await criarObservacao('1', 'Nova observação');

    expect(obs.length).toBe(1);
    expect(obs[0].texto).toBe('Nova observação');
    expect(obs[0].status).toBe('aguardando');
    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        tipo: 'ObservacaoCriada',
        dados: expect.objectContaining({
          id: expect.any(String),
          texto: 'Nova observação',
          lembreteId: '1',
          status: 'aguardando'
        })
      })
    );
  });

  test('Deve listar observações de um lembrete', async () => {
    observacoesPorLembreteId['1'] = [{ id: 'abc', texto: 'teste', status: 'aguardando' }];
    const lista = listarObservacoes('1');
    expect(lista.length).toBe(1);
    expect(lista[0].texto).toBe('teste');
  });
});
