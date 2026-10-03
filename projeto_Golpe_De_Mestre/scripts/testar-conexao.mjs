// Teste de conexão e schema — roda com: node scripts/testar-conexao.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// Lê as variáveis do .env.local (o VITE_ só é injetado pelo Vite, não pelo Node)
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const pegar = (chave) => {
  const linha = env
    .split("\n")
    .find((l) => l.trim().startsWith(chave + "="));
  return linha ? linha.split("=").slice(1).join("=").trim() : "";
};

const url = pegar("VITE_SUPABASE_URL");
const chave = pegar("VITE_SUPABASE_ANON_KEY");

if (!url || !chave) {
  console.error("❌ Variáveis ausentes no .env.local");
  process.exit(1);
}

const supabase = createClient(url, chave);

// 1) Conectividade + Auth
const { error: erroSessao } = await supabase.auth.getSession();
if (erroSessao) {
  console.error("❌ Falha ao conectar:", erroSessao.message);
  process.exit(1);
}
console.log("✅ Conexão com o Supabase estabelecida!");
console.log("   URL:", url);

// 2) Verifica cada tabela esperada com um select limitado
const tabelasEsperadas = [
  "perfis", "turmas", "alunos", "alunos_responsaveis", "inscricoes",
  "presencas", "graduacoes", "aulas_diario", "atividades", "comunicados",
  "solicitacoes", "visitas", "doacoes", "lancamentos", "notificacoes", "configuracoes",
];

let ok = 0;
let faltando = [];

for (const tabela of tabelasEsperadas) {
  const { error } = await supabase.from(tabela).select("*").limit(1);
  if (error && error.code === "PGRST205") {
    faltando.push(tabela);
  } else if (error && error.code === "42501") {
    console.log(`🔒 ${tabela}: existe, bloqueada por RLS para anônimos (esperado ✅)`);
    ok++;
  } else if (error) {
    console.log(`⚠️  ${tabela}: ${error.message}`);
    faltando.push(tabela);
  } else {
    console.log(`📁 ${tabela}: existe e acessível ✅`);
    ok++;
  }
}

console.log("");
if (faltando.length === 0) {
  console.log(`🎉 Schema completo! ${ok}/${tabelasEsperadas.length} tabelas validadas.`);
} else {
  console.log(`⏳ ${ok}/${tabelasEsperadas.length} tabelas prontas.`);
  console.log("   Faltando (rode o supabase/schema.sql no SQL Editor):", faltando.join(", "));
}
