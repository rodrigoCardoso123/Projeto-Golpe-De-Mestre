import { supabase } from "./supabaseClient";

// Atividades e devolutivas. O card mostra o tipo da proposta, o prazo e
// quantas entregas já chegaram, então a listagem junta essas informações.

const TIPOS = {
  reflexao: { nome: "Reflexão", icone: "notebook" },
  pratica: { nome: "Prática", icone: "clipboard" },
};

export function rotuloTipo(tipo) {
  return TIPOS[tipo]?.nome ?? "Prática";
}

function formatarDataBr(iso) {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarDataCurta(iso) {
  if (!iso) return "—";
  const data = new Date(`${iso}T12:00:00`);
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" });
}

// atividade_entregas(count) chega como array por ser relação 1-N.
function contarEntregas(relacao) {
  const linha = Array.isArray(relacao) ? relacao[0] : relacao;
  return linha?.count ?? 0;
}

// O total de alunos da turma é o denominador de "aguardam devolutiva".
function contarAlunos(relacao) {
  const linha = Array.isArray(relacao) ? relacao[0] : relacao;
  return linha?.count ?? 0;
}

function converterAtividade(linha) {
  const entregas = contarEntregas(linha.atividade_entregas);
  const totalAlunos = contarAlunos(linha.turmas?.alunos);

  return {
    id: linha.id,
    turmaId: linha.turma_id,
    turma: linha.turmas?.nome ?? "Todas as turmas",
    tipo: linha.tipo ?? "pratica",
    titulo: linha.titulo,
    descricao: linha.descricao ?? "",
    prazo: linha.prazo,
    prazoBr: formatarDataBr(linha.prazo),
    prazoCurto: formatarDataCurta(linha.prazo),
    entregas,
    aguardando: Math.max(totalAlunos - entregas, 0),
    situacao: linha.situacao === "publicado" ? "Publicada" : "Rascunho",
    situacaoBruta: linha.situacao,
    criadoEm: linha.criado_em,
  };
}

const SELECT_ATIVIDADE = "*, turmas(nome, alunos(count)), atividade_entregas(count)";

export async function listarAtividades() {
  const { data, error } = await supabase
    .from("atividades")
    .select(SELECT_ATIVIDADE)
    .order("prazo", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(converterAtividade);
}

export async function criarAtividade({ titulo, descricao, turmaId, tipo, prazo, situacao }) {
  const { data: sessao } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from("atividades")
    .insert({
      titulo,
      descricao,
      turma_id: turmaId || null,
      tipo,
      prazo: prazo || null,
      situacao: situacao === "publicado" ? "publicado" : "rascunho",
      criado_por: sessao?.user?.id ?? null,
    })
    .select(SELECT_ATIVIDADE)
    .single();

  if (error) throw error;
  return converterAtividade(data);
}

export async function atualizarAtividade(id, campos) {
  const { data, error } = await supabase
    .from("atividades")
    .update({
      titulo: campos.titulo,
      descricao: campos.descricao,
      turma_id: campos.turmaId || null,
      tipo: campos.tipo,
      prazo: campos.prazo || null,
      situacao: campos.situacao === "publicado" ? "publicado" : "rascunho",
    })
    .eq("id", id)
    .select(SELECT_ATIVIDADE)
    .single();

  if (error) throw error;
  return converterAtividade(data);
}

export async function excluirAtividade(id) {
  const { error } = await supabase.from("atividades").delete().eq("id", id);
  if (error) throw error;
}

// Registra (ou remove) a entrega de um aluno.
export async function registrarEntrega({ atividadeId, alunoId, entregue, comentario }) {
  const { data: existente, error: erroBusca } = await supabase
    .from("atividade_entregas")
    .select("id")
    .eq("atividade_id", atividadeId)
    .eq("aluno_id", alunoId)
    .maybeSingle();

  if (erroBusca) throw erroBusca;

  if (entregue) {
    if (existente) {
      const { error } = await supabase
        .from("atividade_entregas")
        .update({ entregue_em: new Date().toISOString(), comentario: comentario ?? null })
        .eq("id", existente.id);
      if (error) throw error;
      return;
    }

    const { error } = await supabase.from("atividade_entregas").insert({
      atividade_id: atividadeId,
      aluno_id: alunoId,
      entregue_em: new Date().toISOString(),
      comentario: comentario ?? null,
    });
    if (error) throw error;
    return;
  }

  if (existente) {
    const { error } = await supabase.from("atividade_entregas").delete().eq("id", existente.id);
    if (error) throw error;
  }
}
