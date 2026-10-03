// Auditoria: encontra <button> e <a> sem onClick/href/to, ou seja, controles
// que o usuário vê mas que não fazem nada.
// Roda com: node scripts/auditar-botoes.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath evita o prefixo duplicado que URL.pathname gera no Windows.
const raiz = fileURLToPath(new URL("../src/", import.meta.url));

function walk(dir) {
  const arquivos = [];

  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);

    if (statSync(caminho).isDirectory()) arquivos.push(...walk(caminho));
    else if (/\.jsx$/.test(nome)) arquivos.push(caminho);
  }

  return arquivos;
}

const problemas = [];

for (const arquivo of walk(raiz)) {
  const linhas = readFileSync(arquivo, "utf8").split("\n");

  linhas.forEach((linha, indice) => {
    const abre = linha.match(/<(button|a)\b/);
    if (!abre) return;

    // Junta a tag até o > de fechamento, para pegar botões multilinha.
    let tag = linha;
    let fim = indice;

    while (!tag.includes(">") && fim + 1 < linhas.length && fim - indice < 20) {
      fim++;
      tag += " " + linhas[fim];
    }

    const temAcao = /onClick|href=|to=|type="submit"/.test(tag);
    if (temAcao) return;

    const rotulo = (tag.match(/>([^<>{}]{1,60})</) || [, "?"])[1].trim();

    problemas.push({
      arquivo: relative(raiz, arquivo),
      linha: indice + 1,
      tag: abre[1],
      rotulo: rotulo || "(ícone)",
    });
  });
}

if (!problemas.length) {
  console.log("OK: nenhum controle sem acao encontrado.");
} else {
  console.log(`${problemas.length} controles sem acao:\n`);

  for (const p of problemas) {
    console.log(`  ${p.arquivo}:${p.linha}  <${p.tag}>  "${p.rotulo}"`);
  }
}
