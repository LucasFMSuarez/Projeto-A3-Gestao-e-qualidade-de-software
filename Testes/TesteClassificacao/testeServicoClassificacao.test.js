// Testes/TesteClassificacao/testeServicoClassificacao.test.js
const { funcoes, processarEvento, palavraChave } = require("../../classificacao/src/servicoClassificacao");
const { enviarEvento } = require("../../classificacao/src/distribuidorEventos");

// mocka o envio de evento para não fazer requisição real
jest.mock("../../classificacao/src/distribuidorEventos", () => ({
  enviarEvento: jest.fn(),
}));

describe("Serviço de Classificação - Funções diretas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("LembreteCriado deve classificar como importante quando contém a palavra-chave", async () => {
    const dados = { id: 1, texto: `algo muito ${palavraChave} aqui` };
    await funcoes.LembreteCriado(dados);

    expect(enviarEvento).toHaveBeenCalledWith("LembreteClassificado", {
      ...dados,
      status: "importante",
    });
  });

  test("LembreteCriado deve classificar como comum quando não contém a palavra-chave", async () => {
    const dados = { id: 2, texto: "texto normal" };
    await funcoes.LembreteCriado(dados);

    expect(enviarEvento).toHaveBeenCalledWith("LembreteClassificado", {
      ...dados,
      status: "comum",
    });
  });

  test("ObservacaoCriada deve classificar corretamente", async () => {
    const dados = { id: 3, texto: "uma observação importante" };
    await funcoes.ObservacaoCriada(dados);

    expect(enviarEvento).toHaveBeenCalledWith("ObservacaoClassificada", {
      ...dados,
      status: "importante",
    });
  });

  test("processarEvento deve ignorar tipo desconhecido", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await processarEvento("EventoDesconhecido", {});
    expect(consoleSpy).toHaveBeenCalledWith(
      " Tipo ignorado pela classificação:",
      "EventoDesconhecido"
    );
    consoleSpy.mockRestore();
  });
});
