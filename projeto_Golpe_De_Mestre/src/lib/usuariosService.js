import { supabase } from "./supabaseClient";

const ROTULO_PAPEL = {
  administrador: "Administrador",
  professor: "Professor",
  responsavel: "Responsável",
};

export function rotuloPapel(papel) {
  return ROTULO_PAPEL[papel] ?? "—";
}

// Lista os perfis da equipe. O RLS já restringe ao que o usuário pode ver.
export async function listarUsuarios() {
  const { data, error } = await supabase
    .from("perfis")
    .select("id, nome, email, papel, situacao, telefone, criado_em")
    .order("nome");

  if (error) throw error;
  return data ?? [];
}

// Cria uma conta já verificada no Auth. A verificação de administrador
// acontece dentro da função SQL — o banco rejeita quem não for admin.
export async function criarUsuario({ email, senha, nome, papel }) {
  const { data, error } = await supabase.rpc("criar_usuario_acesso", {
    email_criado: email,
    senha_criada: senha,
    nome_criado: nome,
    papel_criado: papel,
  });

  if (error) throw error;
  return data;
}

// Altera o cargo ou a situação de um perfil.
export async function atualizarUsuario(id, campos) {
  const { error } = await supabase
    .from("perfis")
    .update(campos)
    .eq("id", id);

  if (error) throw error;
}