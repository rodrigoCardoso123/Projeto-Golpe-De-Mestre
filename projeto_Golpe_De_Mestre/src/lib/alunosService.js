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
    turmaId: linha.turma_id,
    situacao: ROTULO_SITUACAO[linha.situacao] ?? "Ativo",
    situacaoBruta: linha.situacao,
    faixaBruta: linha.faixa,
    idade: linha.idade,
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
  // Traz as presenças junto para calcular o percentual de cada aluno. Sem
  // isso a coluna "Presença" da listagem e das faixas mostraria sempre 0%.
  const { data, error } = await supabase
    .from("alunos")
    .select(`${SELECT}, presencas(status)`)
    .order("nome");

  if (error) throw error;

  return (data ?? []).map((linha) => {
    const lista = linha.presencas ?? [];
    const comparecidas = lista.filter((p) => p.status === "presente").length;

    return converterAluno(linha, comparecidas, lista.length);
  });
}

// Alunos de uma faixa específica, usado pela tela de desenvolvimento.
export async function listarAlunosPorFaixa(faixa) {
  let consulta = supabase.from("alunos").select(SELECT).order("nome");

  if (faixa) consulta = consulta.eq("faixa", faixa);

  const { data, error } = await consulta;
  if (error) throw error;

  return (data ?? []).map((linha) => converterAluno(linha));
}

// Gradua o aluno: grava a faixa no cadastro e registra o histórico, para que
// a evolução não dependa só do valor atual.
export async function graduarAluno({ alunoId, faixa, graus }) {
  const { data: sessao } = await supabase.auth.getSession();

  const { error: erroAluno } = await supabase
    .from("alunos")
    .update({ faixa, graus })
    .eq("id", alunoId);

  if (erroAluno) throw erroAluno;

  const { error: erroHistorico } = await supabase.from("graduacoes").insert({
    aluno_id: alunoId,
    faixa,
    graus,
    data: new Date().toISOString().slice(0, 10),
    registrado_por: sessao?.user?.id ?? null,
  });

  if (erroHistorico) throw erroHistorico;
}

// Histórico de graduações, do mais recente para o mais antigo.
export async function listarGraduacoes(alunoId) {
  const { data, error } = await supabase
    .from("graduacoes")
    .select("*, perfis(nome)")
    .eq("aluno_id", alunoId)
    .order("data", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Ativa/inativa o aluno sem tocar nos demais campos.
export async function alternarSituacaoAluno(id, situacao) {
  const { error } = await supabase
    .from("alunos")
    .update({ situacao: situacao === "Inativo" ? "inativo" : "ativo" })
    .eq("id", id);

  if (error) throw error;
}

// Lista de faixas com os rótulos que as telas exibem.
export const FAIXAS = Object.entries(ROTULO_FAIXA).map(([valor, nome]) => ({
  valor,
  nome,
}));

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