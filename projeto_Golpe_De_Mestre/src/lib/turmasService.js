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