import { supabase } from "./supabaseClient";

// Converte a linha do banco no formato que as telas esperam (id numérico,
// situação com acento, contagem de alunos). Tudo que não existe na tabela
// recebe um valor padrão em vez de quebrar a renderização.
function converterTurma(linha, totalAlunos) {
  return {
    id: linha.id,
    programa: linha.programa ?? "—",
    nome: linha.nome,
    descricao: linha.descricao ?? "",
    professor: linha.perfis?.nome ?? "Não definido",
    esporte: linha.esporte ?? "—",
    horario: [linha.dia_semana, linha.horario].filter(Boolean).join(" · ") || "—",
    local: linha.local ?? "—",
    situacao: linha.situacao === "ativo" ? "Ativa" : "Inativa",
    alunosAtivos: totalAlunos,
    capacidade: linha.lotacao_maxima ?? 0,
  };
}

export async function listarTurmas() {
  const { data, error } = await supabase
    .from("turmas")
    .select("*, alunos(count), perfis(nome)")
    .order("nome");

  if (error) throw error;

  return (data ?? []).map((linha) => {
    // alunos(count) chega como array quando é relação 1-N
    const relacao = Array.isArray(linha.alunos) ? linha.alunos[0] : linha.alunos;
    return converterTurma(linha, relacao?.count ?? 0);
  });
}

export async function buscarTurmaPorId(id) {
  const { data, error } = await supabase
    .from("turmas")
    .select("*, alunos(count), perfis(nome)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const relacao = Array.isArray(data.alunos) ? data.alunos[0] : data.alunos;
  return converterTurma(data, relacao?.count ?? 0);
}

const SELECT_TURMA = "*, alunos(count), perfis(nome)";

// O formulário grava os campos em português; aqui eles viram as colunas do banco.
function montarCorpo(campos) {
  return {
    nome: campos.nome,
    programa: campos.programa,
    professor_id: campos.professorId || null,
    horario: campos.horario || null,
    dia_semana: campos.diaSemana || null,
    lotacao_maxima: Number(campos.lotacao) || 20,
    situacao: campos.situacao === "Inativa" ? "inativo" : "ativo",
    descricao: campos.descricao || null,
    local: campos.local || null,
    esporte: campos.esporte || null,
  };
}

export async function criarTurma(campos) {
  const { data, error } = await supabase
    .from("turmas")
    .insert(montarCorpo(campos))
    .select(SELECT_TURMA)
    .single();

  if (error) throw error;

  const relacao = Array.isArray(data.alunos) ? data.alunos[0] : data.alunos;
  return converterTurma(data, relacao?.count ?? 0);
}

export async function atualizarTurma(id, campos) {
  const { data, error } = await supabase
    .from("turmas")
    .update(montarCorpo(campos))
    .eq("id", id)
    .select(SELECT_TURMA)
    .single();

  if (error) throw error;

  const relacao = Array.isArray(data.alunos) ? data.alunos[0] : data.alunos;
  return converterTurma(data, relacao?.count ?? 0);
}

// O banco usa on delete set null nos alunos vinculados, então a turma some
// sem levar os alunos junto — eles ficam sem turma até serem remanejados.
export async function excluirTurma(id) {
  const { error } = await supabase.from("turmas").delete().eq("id", id);
  if (error) throw error;
}

// Ativa/inativa a turma sem tocar nos demais campos. Existe separada da
// atualizarTurma de propósito: um update parcial não pode apagar o professor
// ou o horário só porque a tela não os mandou.
export async function alternarSituacaoTurma(id, situacao) {
  const { data: turma, error } = await supabase
    .from("turmas")
    .update({ situacao: situacao === "Inativa" ? "inativo" : "ativo" })
    .eq("id", id)
    .select("*, alunos(count), perfis(nome)")
    .single();

  if (error) throw error;

  const relacao = Array.isArray(turma.alunos) ? turma.alunos[0] : turma.alunos;
  return converterTurma(turma, relacao?.count ?? 0);
}

// Professores disponíveis para o seletor do formulário de turma.
export async function listarProfessores() {
  const { data, error } = await supabase
    .from("perfis")
    .select("id, nome, papel")
    .in("papel", ["professor", "administrador"])
    .eq("situacao", "ativo")
    .order("nome");

  if (error) throw error;
  return data ?? [];
}