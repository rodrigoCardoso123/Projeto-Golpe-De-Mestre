import { supabase } from "./supabaseClient";

// Indicadores da visão geral. Cada número é contado no banco — nada aqui é
// fixo no componente, então o painel reflete o que existe de fato.

function contarTotal(tabela, filtro) {
  return supabase.from(tabela).select("id", { count: "exact", head: true }).match(filtro ?? {});
}

// Contagem de alunos ativos e presença do mês corrente.
export async function resumoAlunos() {
  const mesAtual = new Date().toISOString().slice(0, 7);

  const { data: alunos, error: erroAlunos } = await contarTotal("alunos", {
    situacao: "ativo",
  });

  if (erroAlunos) throw erroAlunos;

  const { data: registros, error: erroPresencas } = await supabase
    .from("presencas")
    .select("status, data")
    .gte("data", `${mesAtual}-01`);

  if (erroPresencas) throw erroPresencas;

  const lista = registros ?? [];
  const presentes = lista.filter((linha) => linha.status === "presente").length;

  return {
    alunosAtivos: alunos ?? 0,
    presencas: presentes,
    registros: lista.length,
    percentual: lista.length === 0 ? 0 : Math.round((presentes / lista.length) * 100),
  };
}

// Inscrições ainda não decididas — o número que a coordenação precisa olhar.
export async function contarInscricoes() {
  const { count } = await supabase
    .from("inscricoes")
    .select("id", { count: "exact", head: true })
    .in("situacao", ["analise", "espera"]);

  return count ?? 0;
}

// Aulas planejadas ou realizadas nos próximos 7 dias.
export async function contarProximasAulas() {
  const hoje = new Date();
  const limite = new Date(hoje);
  limite.setDate(limite.getDate() + 7);

  const { count } = await supabase
    .from("aulas_diario")
    .select("id", { count: "exact", head: true })
    .gte("data", hoje.toISOString().slice(0, 10))
    .lte("data", limite.toISOString().slice(0, 10));

  return count ?? 0;
}

// Solicitações que ainda precisam de resposta.
export async function contarSolicitacoes() {
  const { count } = await supabase
    .from("solicitacoes")
    .select("id", { count: "exact", head: true })
    .neq("situacao", "resolvida");

  return count ?? 0;
}

// Alunos em faixa preta — o grupo que indica avaliações a marcar.
export async function contarAvaliacoes() {
  const { count } = await supabase
    .from("alunos")
    .select("id", { count: "exact", head: true })
    .eq("situacao", "ativo")
    .eq("faixa", "preta");

  return count ?? 0;
}

// Últimos comunicados, para o mural do topo não ficar parado.
export async function listarUltimosComunicados(limite = 3) {
  const { data, error } = await supabase
    .from("comunicados")
    .select("*, perfis(nome)")
    .eq("situacao", "publicado")
    .order("criado_em", { ascending: false })
    .limit(limite);

  if (error) throw error;

  return (data ?? []).map((comunicado) => ({
    titulo: comunicado.titulo,
    texto: comunicado.conteudo,
    autor: comunicado.perfis?.nome ?? "Coordenação",
    data: new Date(comunicado.criado_em).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
  }));
}

// Presença por turma no mês, para as barras da seção de acompanhamento.
export async function presencaPorTurma() {
  const mesAtual = new Date().toISOString().slice(0, 7);

  const { data: turmas, error: erroTurmas } = await supabase
    .from("turmas")
    .select("id, nome, programa")
    .order("nome");

  if (erroTurmas) throw erroTurmas;

  const { data: registros, error: erroPresencas } = await supabase
    .from("presencas")
    .select("turma_id, status")
    .gte("data", `${mesAtual}-01`);

  if (erroPresencas) throw erroPresencas;

  const lista = registros ?? [];

  return (turmas ?? []).map((turma) => {
    const daTurma = lista.filter((linha) => linha.turma_id === turma.id);

    const presentes = daTurma.filter(
      (linha) => linha.status === "presente"
    ).length;

    return {
      id: turma.id,
      nome: turma.nome,
      programa: turma.programa ?? "—",
      registros: daTurma.length,
      // Sem registros não há porcentagem a mostrar — a exibe como "—".
      percentual: daTurma.length === 0 ? null : Math.round((presentes / daTurma.length) * 100),
    };
  });
}

// Agenda dos próximos 7 dias: uma linha por dia, contando as aulas dela.
export async function agendaProximosDias(dias = 7) {
  const { data: aulas, error } = await supabase
    .from("aulas_diario")
    .select("data, turmas(nome)")
    .gte("data", new Date().toISOString().slice(0, 10))
    .order("data");

  if (error) throw error;

  const agenda = Array.from({ length: dias }, (_, indice) => {
    const data = new Date();
    data.setDate(data.getDate() + indice);

    const iso = data.toISOString().slice(0, 10);

    return {
      iso,
      numero: data.getDate(),
      rotulo: indice === 0 ? "Hoje" : data.toLocaleDateString("pt-BR", { weekday: "short" }),
      aulas: (aulas ?? []).filter((aula) => aula.data === iso),
      hoje: indice === 0,
    };
  });

  return agenda;
}
