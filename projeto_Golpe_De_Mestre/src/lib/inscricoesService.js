import { supabase } from "./supabaseClient";

// Inscrições: a candidatura entra aqui e vira aluno quando é matriculada.
// A enum do banco é analise/espera/matriculada/recusada; a tela usa rótulos
// mais amigáveis, então a conversão fica concentrada neste arquivo.

const ROTULO_SITUACAO = {
  analise: { nome: "Em análise", classe: "badge_analise" },
  espera: { nome: "Lista de espera", classe: "badge_espera" },
  matriculada: { nome: "Matriculada", classe: "badge_matriculada" },
  recusada: { nome: "Recusada", classe: "badge_recusada" },
};

export const SITUACOES = ROTULO_SITUACAO;

export const FILTROS = [
  { chave: "todas", nome: "Todas" },
  { chave: "analise", nome: "Em análise" },
  { chave: "espera", nome: "Lista de espera" },
  { chave: "matriculada", nome: "Matriculada" },
  { chave: "recusada", nome: "Recusada" },
];

function formatarData(iso) {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function converterInscricao(linha) {
  const situacao = ROTULO_SITUACAO[linha.situacao] ?? ROTULO_SITUACAO.analise;

  return {
    id: linha.id,
    candidato: linha.nome_aluno,
    responsavel: linha.nome_mae || linha.nome_pai || "—",
    nomeMae: linha.nome_mae ?? "",
    nomePai: linha.nome_pai ?? "",
    idade: linha.idade,
    escola: linha.escola ?? "",
    endereco: linha.endereco ?? "",
    telefone: linha.telefone ?? "",
    programa: linha.programa ?? "",
    data: formatarData(linha.criado_em?.slice(0, 10)),
    situacao: situacao.nome,
    situacaoBruta: linha.situacao,
    classeSituacao: situacao.classe,
  };
}

export async function listarInscricoes() {
  const { data, error } = await supabase
    .from("inscricoes")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(converterInscricao);
}

export async function criarInscricao({ nomeAluno, idade, escola, endereco, nomeMae, nomePai, telefone, programa }) {
  const { data, error } = await supabase
    .from("inscricoes")
    .insert({
      nome_aluno: nomeAluno,
      idade: idade ? Number(idade) : null,
      escola,
      endereco,
      nome_mae: nomeMae,
      nome_pai: nomePai,
      telefone,
      situacao: "analise",
    })
    .select("*")
    .single();

  if (error) throw error;
  return converterInscricao(data);
}

export async function atualizarInscricao(id, campos) {
  const { data, error } = await supabase
    .from("inscricoes")
    .update({
      nome_aluno: campos.nomeAluno,
      idade: campos.idade ? Number(campos.idade) : null,
      escola: campos.escola,
      endereco: campos.endereco,
      nome_mae: campos.nomeMae,
      nome_pai: campos.nomePai,
      telefone: campos.telefone,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return converterInscricao(data);
}

export async function atualizarSituacaoInscricao(id, situacao) {
  const { data, error } = await supabase
    .from("inscricoes")
    .update({ situacao })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return converterInscricao(data);
}

export async function excluirInscricao(id) {
  const { error } = await supabase.from("inscricoes").delete().eq("id", id);
  if (error) throw error;
}

// Matrícula: a inscrição vira aluno. Criar aluno e marcar a inscrição como
// matriculada são duas escritas — se a segunda falhar, o aluno fica órfão,
// então a situation é revertida para não deixar os dois fora de sincronia.
export async function matricularInscricao(inscricaoId, { turmaId, faixa = "branca" }) {
  const { data: inscricao, error: erroLeitura } = await supabase
    .from("inscricoes")
    .select("*")
    .eq("id", inscricaoId)
    .single();

  if (erroLeitura) throw erroLeitura;

  const { data: aluno, error: erroAluno } = await supabase
    .from("alunos")
    .insert({
      nome: inscricao.nome_aluno,
      idade: inscricao.idade,
      escola: inscricao.escola,
      endereco: inscricao.endereco,
      nome_mae: inscricao.nome_mae,
      nome_pai: inscricao.nome_pai,
      telefone: inscricao.telefone,
      turma_id: turmaId || null,
      faixa,
      situacao: "ativo",
    })
    .select("*")
    .single();

  if (erroAluno) throw erroAluno;

  const { error: erroSituacao } = await supabase
    .from("inscricoes")
    .update({ situacao: "matriculada" })
    .eq("id", inscricaoId);

  if (erroSituacao) {
    // Desfaz o aluno para não deixar uma matrícula pela metade.
    await supabase.from("alunos").delete().eq("id", aluno.id);
    throw erroSituacao;
  }

  return aluno;
}
