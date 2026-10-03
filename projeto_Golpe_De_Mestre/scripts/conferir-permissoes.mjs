// Confere se o mapa de permissões do frontend bate com as policies reais do banco.
// Divergência aqui é perigosa: o menu esconderia uma área que o banco libera,
// ou o menu mostraria uma área que o banco bloqueia sem explicar o motivo.
// Roda com: node scripts/conferir-permissoes.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const pegar = (chave) => {
  const linha = env.split("\n").find((l) => l.trim().startsWith(chave + "="));
  return linha ? linha.split("=").slice(1).join("=").trim() : "";
};

const supabase = createClient(pegar("VITE_SUPABASE_URL"), pegar("VITE_SUPABASE_ANON_KEY"));

// area da tela -> tabela que ela consulta
const AREA_TABELA = {
  inscricoes: "inscricoes",
  alunos: "alunos",
  turmas: "turmas",
  diario: "aulas_diario",
  presenca: "presencas",
  desenvolvimento: "graduacoes",
  atividades: "atividades",
  comunicados: "comunicados",
  solicitacoes: "solicitacoes",
  visitas: "visitas",
  doacoes: "doacoes",
  relatorios: "configuracoes",
  configuracoes: "configuracoes",
  equipe: "perfis",
  apoiadores: "configuracoes",
  financeiro: "lancamentos",
};

// Áreas que só o admin enxerga no menu e no banco
const SO_ADMIN = ["visitas", "doacoes", "financeiro", "apoiadores", "equipe", "configuracoes", "relatorios"];

console.log("🔒 Testando leitura anônima (deve falhar em todas):\n");

const vazando = [];

for (const [area, tabela] of Object.entries(AREA_TABELA)) {
  const { data, error } = await supabase.from(tabela).select("*").limit(3);

  if (!error && data && data.length > 0) {
    console.log(`🚨 ${area} (${tabela}): ANÔNIMO CONSEGUE LER!`);
    vazando.push(area);
  } else {
    console.log(`🔒 ${area} (${tabela}): bloqueada para anônimo`);
  }
}

console.log("\n" + "=".repeat(50));

if (vazando.length > 0) {
  console.log(`⚠️  ${vazando.length} área(s) expostas: ${vazando.join(", ")}`);
  process.exit(1);
}

console.log("✅ Nenhuma área é acessível sem login.\n");
console.log("Áreas restritas a administrador:");
console.log("   " + SO_ADMIN.join(", "));
console.log("\n📋 Lembre-se: o teste acima roda como anônimo.");
console.log("   Para validar por cargo, crie um usuário de cada papel e faca login");
console.log("   com ele em um script separado.");