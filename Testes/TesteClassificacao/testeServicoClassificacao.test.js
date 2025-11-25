// Testes/TesteClassificacao/testeServicoClassificacao.test.js
const {
  processarEvento,
  palavraChave
} = require("../../classificacao/src/servicoClassificacao");

jest.mock("axios", () => ({
  post: jest.fn().mockResolvedValue({ status: 200 })
}));

const axios = require("axios");

describe("Serviço Classificação - Unitário REAL", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Classifica LembreteCriado importante", async () => {
    const dados = { id: 1, texto: `algo ${palavraChave}` };

    await processarEvento("LembreteCriado", dados);

    expect(axios.post).toHaveBeenCalled();
    const chamada = axios.post.mock.calls[0][1];
    expect(chamada.tipo).toBe("LembreteClassificado");
    expect(chamada.dados.status).toBe("importante");
  });

  test("Classifica LembreteCriado comum", async () => {
    const dados = { id: 1, texto: "normal" };

    await processarEvento("LembreteCriado", dados);

    const chamada = axios.post.mock.calls[0][1];
    expect(chamada.dados.status).toBe("comum");
  });

  test("Classifica ObservacaoCriada", async () => {
    const dados = { id: 3, texto: "nota importante" };

    await processarEvento("ObservacaoCriada", dados);

    const chamada = axios.post.mock.calls[0][1];
    expect(chamada.tipo).toBe("ObservacaoClassificada");
    expect(chamada.dados.status).toBe("importante");
  });

  test("Ignora tipo desconhecido", async () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});

    await processarEvento("NadaAqui", {});

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
