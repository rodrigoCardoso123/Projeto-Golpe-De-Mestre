import { supabase } from "./supabaseClient";

// Presenças: a tela registra a chamada inteira em uma data, então o service
// carrega o que já existe naquele dia e salva o lote inteiro de uma vez.

const STATUS = ["presente", "ausente", "justificado"];

export function rotuloStatus(status) {
  return status === "presente"
    ? "Presente"
    : status === "justificado"
      ? "Justificado"
      : "Ausente";
}

// Carrega os alunos da turma com a presença já registrada na data informada.
// Turma vazia traz todos os alunos ativos.
export async function listarPresencas({ turmaId, data }) {
  let consulta = supabase
    .from("alunos")
    .select(
      "id, nome, faixa, graus, turma_id, turmas(nome), presencas(id, status, observacao, data)"
    )
    .eq("situacao", "ativo")
    .order("nome");

  if (turmaId) consulta = consulta.eq("turma_id", turmaId);

  const { data: alunos, error } = await consulta;
  if (error) throw error;

  return (alunos ?? []).map((aluno) => {
    // Só considera a presença da data filtrada, não as de outros dias.
    const doDia = (aluno.presencas ?? []).find((p) => p.data === data);

    return {
      alunoId: aluno.id,
      nome: aluno.nome,
      turmaId: aluno.turma_id,
      turma: aluno.turmas?.nome ?? "—",
      faixa: aluno.faixa,
      graus: aluno.graus,
      status: doDia?.status ?? "",
      observacao: doDia?.observacao ?? "",
    };
  });
}

// Grava as presenças da chamada. Um upsert por aluno resolve o detalhe de a
// linha já existir (unique em aluno_id + turma_id + data): atualiza em vez
// de falhar com duplicata quando a chamada é salva duas vezes.
export async function salvarPresencas({ turmaId, data, registros }) {
  const { data: sessao } = await supabase.auth.getSession();
  const usuarioId = sessao?.user?.id ?? null;

  const validos = registros
    .filter((registro) => STATUS.includes(registro.status))
    .map((registro) => ({
      aluno_id: registro.alunoId,
      turma_id: registro.turmaId ?? turmaId,
      data,
      status: registro.status,
      observacao: registro.observacao || null,
      registrado_por: usuarioId,
    }));

  if (validos.length === 0) return [];

  const { data: gravadas, error } = await supabase
    .from("presencas")
    .upsert(validos, { onConflict: "aluno_id,turma_id,data" })
    .select();

  if (error) throw error;
  return gravadas ?? [];
}

// ============================================================================
// SOLICITAÇÕES
// ============================================================================

function formatarDataBr(iso) {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function rotularSituacao(situacao) {
  if (situacao === "em_andamento") return "Em acompanhamento";
  if (situacao === "resolvida") return "Respondida";
  return "Nova";
}

function converterSolicitacao(linha) {
  return {
    id: linha.id,
    alunoId: linha.aluno_id,
    aluno: linha.alunos?.nome ?? "—",
    responsavel: linha.perfis?.nome ?? "—",
    assunto: linha.assunto,
    mensagem: linha.mensagem,
    resposta: linha.resposta ?? "",
    situacao: rotularSituacao(linha.situacao),
    situacaoBruta: linha.situacao,
    data: formatarDataBr(linha.criado_em.slice(0, 10)),
  };
}

export async function listarSolicitacoes() {
  const { data: solicitacoes, error } = await supabase
    .from("solicitacoes")
    .select("*, alunos(nome), perfis(nome)")
    .order("criado_em", { ascending: false });

  if (error) throw error;
  return (solicitacoes ?? []).map(converterSolicitacao);
}

// Grava a resposta e move a solicitação para "resolvida".
export async function responderSolicitacao(id, resposta) {
  const { data: solicitacao, error } = await supabase
    .from("solicitacoes")
    .update({ resposta, respondido_em: new Date().toISOString(), situacao: "resolvida" })
    .eq("id", id)
    .select("*, alunos(nome), perfis(nome)")
    .single();

  if (error) throw error;
  return converterSolicitacao(solicitacao);
}

export async function atualizarSituacaoSolicitacao(id, situacao) {
  const { data: solicitacao, error } = await supabase
    .from("solicitacoes")
    .update({ situacao })
    .eq("id", id)
    .select("*, alunos(nome), perfis(nome)")
    .single();

  if (error) throw error;
  return converterSolicitacao(solicitacao);
}
