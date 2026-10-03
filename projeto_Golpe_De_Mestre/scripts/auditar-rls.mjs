// Auditoria de segurança: confere se o RLS está ligado e quais policies existem.
// Roda com: node scripts/auditar-rls.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const pegar = (chave) => {
  const linha = env.split("\n").find((l) => l.trim().startsWith(chave + "="));
  return linha ? linha.split("=").slice(1).join("=").trim() : "";
};

const supabase = createClient(pegar("VITE_SUPABASE_URL"), pegar("VITE_SUPABASE_ANON_KEY"));

const tabelas = [
  "perfis", "turmas", "alunos", "alunos_responsaveis", "inscricoes",
  "presencas", "graduacoes", "aulas_diario", "atividades", "comunicados",
  "solicitacoes", "visitas", "doacoes", "lancamentos", "notificacoes", "configuracoes",
];

console.log("Testando cada tabela como ANÔNIMO (sem login):\n");

const expostas = [];

for (const tabela of tabelas) {
  const { data, error } = await supabase.from(tabela).select("*").limit(3);

  if (error) {
    console.log(`🔒 ${tabela}: bloqueada (${error.code})`);
    continue;
  }

  if (data && data.length > 0) {
    console.log(`🚨 ${tabela}: DEVOLVEU ${data.length} linha(s) para anônimo!`);
    expostas.push(tabela);
    console.log(`   Exemplo: ${JSON.stringify(data[0]).slice(0, 120)}`);
  } else {
    console.log(`➖ ${tabela}: anônimo não vê dados (RLS ativo, tabela vazia)`);
  }
}

console.log("\n" + "=".repeat(50));
if (expostas.length > 0) {
  console.log(`⚠️  ${expostas.length} tabela(s) vazando para anônimo: ${expostas.join(", ")}`);
} else {
  console.log("✅ Nenhuma tabela expõe dados para usuário anônimo.");
}