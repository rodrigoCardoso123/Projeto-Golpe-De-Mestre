import { supabase } from "./supabaseClient";

const ROTULO_SITUACAO = { ativo: "Ativo", inativo: "Inativo" };
const ROTULO_FAIXA = {
  branca: "Branca",
  cinza: "Cinza",
  amarela: "Amarela",
  laranja: "Laranja",
  verde: "Verde",
  azul: "Azul",
  roxa: "Roxa",
  marrom: "Marrom",
  preta: "Preta",
};

// Iniciais usadas no avatar da listagem.
function iniciais(nome) {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

// Converte a linha do banco no formato esperado pelas telas.
function converterAluno(linha, presencas = 0, totalPresencas = 0) {
  const percentual = totalPresencas > 0 ? Math.round((presencas / totalPresencas) * 100) : 0;

  return {
    id: linha.id,
    iniciais: iniciais(linha.nome),
    nome: linha.nome,
    categoria: linha.turmas?.programa ?? "—",
    turma: linha.turmas?.nome ?? "Sem turma",
    situacao: ROTULO_SITUACAO[linha.situacao] ?? "Ativo",
    presenca: percentual,
    faltas: Math.max(totalPresencas - presencas, 0),
    avaliacoes: 0,
    faixa: {
      nome: ROTULO_FAIXA[linha.faixa] ?? "Branca",
      graus: linha.graus ?? 0,
      imagem: `/Faixa - ${ROTULO_FAIXA[linha.faixa] ?? "branca"}.png`,
    },
    perfil: {
      matricula: (linha.criado_em ?? "").slice(0, 10).split("-").reverse().join("/"),
      ultimaGraduacao: null,
      professor: linha.turmas?.perfis?.nome ?? "Não definido",
      idade: linha.idade,
      nomeMae: linha.nome_mae,
      nomePai: linha.nome_pai,
      escola: linha.escola,
      telefone: linha.telefone,
      endereco: linha.endereco,
      documentoAluno: null,
      documentoResponsavel: null,
    },
  };
}

const SELECT = "*, turmas(nome, programa, perfis(nome))";

export async function listarAlunos() {
  const { data, error } = await supabase
    .from("alunos")
    .select(SELECT)
    .order("nome");

  if (error) throw error;

  return (data ?? []).map((linha) => converterAluno(linha));
}

export async function buscarAlunoPorId(id) {
  const { data, error } = await supabase
    .from("alunos")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  // Presenças do aluno viram o percentual mostrado na listagem
  const { data: presencas } = await supabase
    .from("presencas")
    .select("status")
    .eq("aluno_id", id);

  const lista = presencas ?? [];
  const comparecidas = lista.filter((p) => p.status === "presente").length;

  return converterAluno(data, comparecidas, lista.length);
}