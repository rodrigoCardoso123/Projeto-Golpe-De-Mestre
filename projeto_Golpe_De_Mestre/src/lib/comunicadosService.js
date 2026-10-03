import { supabase } from "./supabaseClient";

// Comunicados do mural. Cada perfil confirma a própria leitura; a contagem
// mostrada no card soma as confirmações de toda a equipe.

function formatarData(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}

// comunicados_leituras(count) chega como array por ser relação 1-N.
function contarLeituras(relacao) {
  const linha = Array.isArray(relacao) ? relacao[0] : relacao;
  return linha?.count ?? 0;
}

function converterComunicado(linha, lidosPorMim) {
  return {
    id: linha.id,
    titulo: linha.titulo,
    texto: linha.conteudo,
    data: formatarData(linha.criado_em),
    autor: linha.perfis?.nome ?? "Coordenação",
    situacao: linha.situacao === "publicado" ? "Publicado" : "Rascunho",
    situacaoBruta: linha.situacao,
    confirmacoes: contarLeituras(linha.comunicados_leituras),
    euLi: lidosPorMim.includes(linha.id),
  };
}

const SELECT_COMUNICADO = "*, perfis(nome), comunicados_leituras(count)";

export async function listarComunicados() {
  const { data: sessao } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from("comunicados")
    .select(SELECT_COMUNICADO)
    .order("criado_em", { ascending: false });

  if (error) throw error;

  // Busca os ids que ESTE perfil já confirmou, para marcar o card como lido.
  const { data: minhas } = await supabase
    .from("comunicados_leituras")
    .select("comunicado_id")
    .eq("perfil_id", sessao?.user?.id ?? "");

  const lidosPorMim = (minhas ?? []).map((linha) => linha.comunicado_id);

  return (data ?? []).map((linha) => converterComunicado(linha, lidosPorMim));
}

export async function criarComunicado({ titulo, conteudo, situacao }) {
  const { data: sessao } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from("comunicados")
    .insert({
      titulo,
      conteudo,
      situacao: situacao === "publicado" ? "publicado" : "rascunho",
      criado_por: sessao?.user?.id ?? null,
    })
    .select(SELECT_COMUNICADO)
    .single();

  if (error) throw error;
  return converterComunicado(data, []);
}

export async function atualizarComunicado(id, campos) {
  const { data, error } = await supabase
    .from("comunicados")
    .update({
      titulo: campos.titulo,
      conteudo: campos.conteudo,
      situacao: campos.situacao === "publicado" ? "publicado" : "rascunho",
    })
    .eq("id", id)
    .select(SELECT_COMUNICADO)
    .single();

  if (error) throw error;
  return converterComunicado(data, []);
}

export async function excluirComunicado(id) {
  const { error } = await supabase.from("comunicados").delete().eq("id", id);
  if (error) throw error;
}

// Confirma a leitura. A policy do banco só aceita perfil_id = auth.uid(),
// então quem tentar ler em nome de outra pessoa é barrado no servidor.
export async function confirmarLeitura(comunicadoId) {
  const { data: sessao } = await supabase.auth.getSession();

  const { error } = await supabase
    .from("comunicados_leituras")
    .insert({ comunicado_id: comunicadoId, perfil_id: sessao?.user?.id });

  // Duplicar a confirmação não é erro: o card já mostra "lido".
  if (error && error.code !== "23505") throw error;
}

export async function desfazerLeitura(comunicadoId) {
  const { data: sessao } = await supabase.auth.getSession();

  const { error } = await supabase
    .from("comunicados_leituras")
    .delete()
    .eq("comunicado_id", comunicadoId)
    .eq("perfil_id", sessao?.user?.id ?? "");

  if (error) throw error;
}
