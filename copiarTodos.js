const fs = require('fs');
const path = require('path');

// Pasta que você quer ler
const pasta = path.join(__dirname, ''); // deixa '' se for a mesma pasta do script
// Arquivo de saída
const arquivoSaida = path.join(__dirname, 'todosCodigos.js');

// Função para ler arquivos recursivamente ignorando node_modules
function lerArquivos(dir) {
    let conteudoTotal = '';

    const arquivos = fs.readdirSync(dir, { withFileTypes: true });

    for (const arquivo of arquivos) {
        const caminho = path.join(dir, arquivo.name);

        if (arquivo.isDirectory()) {
            if (arquivo.name !== 'node_modules') {
                conteudoTotal += lerArquivos(caminho); // recursivo
            }
        } else {
            const ext = path.extname(arquivo.name);
            if (ext === '.js' || ext === '.ts') { // pode adicionar outras extensões se quiser
                const conteudo = fs.readFileSync(caminho, 'utf-8');
                conteudoTotal += `\n// ===== ${arquivo.name} =====\n`;
                conteudoTotal += conteudo + '\n';
            }
        }
    }

    return conteudoTotal;
}

// Escreve tudo no arquivo de saída
fs.writeFileSync(arquivoSaida, lerArquivos(pasta), 'utf-8');

console.log('Todos os códigos foram copiados para:', arquivoSaida);