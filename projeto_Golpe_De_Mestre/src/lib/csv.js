// Utilitários de exportação. CSV e impressão aparecem em várias telas do
// painel, então ficam aqui em vez de serem reimplementados a cada botão.

// Monta o arquivo .csv a partir de um cabeçalho e das linhas já formatadas.
// Usa ";" como separador porque é o que o Excel em pt-BR espera ao abrir.
export function baixarCSV(nomeArquivo, cabecalho, linhas) {
  const conteudo = [cabecalho, ...linhas]
    .map((linha) => linha.map(campo => escaparCampo(campo)).join(";"))
    .join("\r\n");

  // O \uFEFF (BOM) evita que acentos apareçam quebrados no Excel.
  const blob = new Blob(["\uFEFF" + conteudo], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo.endsWith(".csv") ? nomeArquivo : `${nomeArquivo}.csv`;
  link.click();

  // Libera o object URL depois do clique, senão o arquivo fica preso na memória.
  URL.revokeObjectURL(url);
}

// Aspas e quebras de linha dentro de um campo quebrariam a coluna; o padrão
// é envolver em aspas e dobrar as aspas internas.
function escaparCampo(valor) {
  const texto = valor === null || valor === undefined ? "" : String(valor);

  if (/[";\n\r]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }

  return texto;
}

// Data compacta no nome do arquivo, para não precisar renomear manualmente.
export function carimboData() {
  return new Date().toISOString().slice(0, 10);
}

// Abre a caixa de impressão com o conteúdo atual da página.
// O CSS de impressão de cada tela esconde o menu lateral antes de imprimir.
export function imprimirPagina() {
  window.print();
}
