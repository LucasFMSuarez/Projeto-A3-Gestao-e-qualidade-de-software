// Testes/TesteClassificacao/testeServicoClassificacao.test.js

const {
  processarEvento,
  palavraChave
} = require("../../classificacao/src/servicoClassificacao");

const { enviarEvento } = require("../../classificacao/src/distribuidorEventos");

// mocka o envio de evento para não fazer chamada real
jest.mock("../../classificacao/src/distribuidorEventos", () => ({
  enviarEvento: jest.fn(),
}));

describe("Serviço de Classificação - Funções diretas (via processarEvento)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("LembreteCriado deve classificar como importante quando contém a palavra-chave", async () => {
    const dados = { id: 1, texto: `algo muito ${palavraChave} aqui` };

    await processarEvento("LembreteCriado", dados);

    expect(enviarEvento).toHaveBeenCalledWith("LembreteClassificado", {
      ...dados,
      status: "importante",
    });
  });

  test("LembreteCriado deve classificar como comum quando não contém a palavra-chave", async () => {
    const dados = { id: 2, texto: "texto normal" };

    await processarEvento("LembreteCriado", dados);

    expect(enviarEvento).toHaveBeenCalledWith("LembreteClassificado", {
      ...dados,
      status: "comum",
    });
  });

  test("ObservacaoCriada deve classificar corretamente", async () => {
    const dados = { id: 3, texto: "uma observação importante" };

    await processarEvento("ObservacaoCriada", dados);

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
