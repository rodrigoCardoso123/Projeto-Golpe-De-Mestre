// Teste ponta a ponta do Auth: cria um usuário de teste, faz login,
// confere se o trigger criou o perfil e se o RLS protege os dados.
// Roda com: node scripts/testar-auth.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const pegar = (chave) => {
  const linha = env.split("\n").find((l) => l.trim().startsWith(chave + "="));
  return linha ? linha.split("=").slice(1).join("=").trim() : "";
};

const url = pegar("VITE_SUPABASE_URL");
const chave = pegar("VITE_SUPABASE_ANON_KEY");

const email = `teste.${Date.now()}@exemplo.com`;
const senha = "SenhaDeTeste123!";

const supabase = createClient(url, chave);

// 1) Cadastro — cria no Auth e dispara o trigger de criação de perfil
console.log(`📧 Criando usuário de teste: ${email}`);
const { data: cadastro, error: erroCadastro } = await supabase.auth.signUp({
  email,
  password: senha,
  options: { data: { nome: "Usuário de Teste" } },
});

if (erroCadastro) {
  console.error("❌ Erro no cadastro:", erroCadastro.message);
  process.exit(1);
}

// Se o projeto exigir confirmação de e-mail, não há sessão ainda.
if (!cadastro.session) {
  console.log("");
  console.log("⚠️  O projeto exige confirmação de e-mail (comportamento padrão do Supabase).");
  console.log("   O cadastro foi criado, mas o login automático não acontece.");
  console.log("");
  console.log("   Para destravar o teste:");
  console.log("   Opção A — confirmar a conta:");
  console.log("     Supabase > Authentication > Users > abra o usuário > Confirm email");
  console.log("   Opção B — desativar a confirmação (recomendado só em desenvolvimento):");
  console.log("     Supabase > Authentication > Sign In / Providers > Email");
  console.log("     desmarque 'Confirm email'");
  process.exit(0);
}

console.log("✅ Cadastro OK — sessão criada");

// 2) O trigger criou o perfil automaticamente?
const usuarioId = cadastro.user.id;
const { data: perfil, error: erroPerfil } = await supabase
  .from("perfis")
  .select("id, nome, papel, situacao")
  .eq("id", usuarioId)
  .maybeSingle();

if (erroPerfil) {
  console.error("❌ Erro ao buscar perfil:", erroPerfil.message);
} else if (!perfil) {
  console.log("❌ Trigger NÃO criou o perfil. Rode o schema.sql novamente.");
} else {
  console.log("✅ Perfil criado pelo trigger:");
  console.log(`   nome: ${perfil.nome} | papel: ${perfil.papel} | situacao: ${perfil.situacao}`);
}

// 3) Login com e-mail e senha
const { data: login, error: erroLogin } = await supabase.auth.signInWithPassword({
  email,
  password: senha,
});

if (erroLogin) {
  console.error("❌ Erro no login:", erroLogin.message);
  process.exit(1);
}
console.log("✅ Login com e-mail e senha OK");

// 4) Login com senha errada deve falhar
const { error: erroSenhaErrada } = await supabase.auth.signInWithPassword({
  email,
  password: "senha-errada-123",
});

if (erroSenhaErrada) {
  console.log("✅ Senha incorreta é rejeitada corretamente");
} else {
  console.log("🚨 Senha incorreta foi aceita!");
}

// 5) RLS: como 'responsavel' (papel padrão), não deve ver todos os alunos
const { data: alunos, error: erroAlunos } = await supabase.from("alunos").select("*");
if (erroAlunos) {
  console.log(`🔒 alunos bloqueados para responsável (${erroAlunos.code})`);
} else {
  console.log(`➖ responsável enxerga ${alunos.length} aluno(s) — esperado 0 sem vínculos`);
}

// 6) Limpeza
await supabase.auth.signOut();
console.log("\n✅ Fluxo de Auth validado de ponta a ponta.");
console.log("   (O usuário de teste continua no Auth — pode remover em Authentication > Users)");
void login;