const axios = require('axios');
const { enviarEvento } = require('../../lembretes/src/distribuidorEventos');

describe('Teste do distribuidor de eventos', () => {
  test('deve enviar evento via axios.post', async () => {
    // Cria um spy no axios.post para interceptar chamadas
    const spy = jest.spyOn(axios, 'post').mockResolvedValue({ status: 200 });

    await enviarEvento("Teste", { exemplo: 1 });

    expect(spy).toHaveBeenCalledWith(
      "http://localhost:10000/eventos",
      {
        tipo: "Teste",
        dados: { exemplo: 1 }
      }
    );

    // Limpa o spy para não afetar outros testes
    spy.mockRestore();
  });
});