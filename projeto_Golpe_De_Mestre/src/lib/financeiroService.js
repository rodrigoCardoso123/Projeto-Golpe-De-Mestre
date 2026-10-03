import { supabase } from "./supabaseClient";

// Financeiro: lançamentos de entrada e saída, com saldo derivado dos dados.
// A tabela não guarda saldo — ele é sempre calculado a partir dos lançamentos,
// para que uma correção em qualquer linha reflita no número imediatamente.

const CATEGORIAS = [
  "Doações",
  "Materiais",
  "Mensalidades",
  "Equipamentos",
  "Eventos",
  "Infraestrutura",
  "Outras",
];

export function categoriasFinanceiras() {
  return CATEGORIAS;
}

function formatarDataBr(iso) {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Converte a linha do banco no formato usado pela tabela e pelos cartões.
function converterLancamento(linha) {
  const numerico = Number(linha.valor);
  const ehEntrada = linha.tipo === "entrada";

  return {
    id: linha.id,
    data: formatarDataBr(linha.data),
    dataIso: linha.data,
    descricao: linha.descricao,
    categoria: linha.categoria,
    tipo: ehEntrada ? "Entrada" : "Saída",
    tipoBruto: linha.tipo,
    valor: numerico,
    valorFormatado: `${ehEntrada ? "+" : "-"} ${formatarMoeda(numerico)}`,
    doacaoId: linha.doacao_id,
  };
}

// Devolve os lançamentos já filtrados e, junto, os totais do período.
// Separar os cálculos aqui evita que cada tela refaça a mesma conta.
export async function listarLancamentos({ tipo, categoria, mes } = {}) {
  let consulta = supabase
    .from("lancamentos")
    .select("*")
    .order("data", { ascending: false });

  if (tipo) consulta = consulta.eq("tipo", tipo);
  if (categoria) consulta = consulta.eq("categoria", categoria);
  if (mes) consulta = consulta.like("data", `${mes}-%`);

  const { data, error } = await consulta;
  if (error) throw error;

  const lancamentos = (data ?? []).map(converterLancamento);

  const totalEntradas = lancamentos
    .filter((l) => l.tipoBruto === "entrada")
    .reduce((soma, l) => soma + l.valor, 0);

  const totalSaidas = lancamentos
    .filter((l) => l.tipoBruto === "saida")
    .reduce((soma, l) => soma + l.valor, 0);

  const saidasPorCategoria = lancamentos
    .filter((l) => l.tipoBruto === "saida")
    .reduce((acumulado, l) => {
      acumulado[l.categoria] = (acumulado[l.categoria] ?? 0) + l.valor;
      return acumulado;
    }, {});

  return {
    lancamentos,
    totalEntradas,
    totalSaidas,
    saldo: totalEntradas - totalSaidas,
    saidasPorCategoria,
  };
}

export async function criarLancamento({ data, descricao, categoria, tipo, valor }) {
  const { data: sessao } = await supabase.auth.getSession();

  const { data: lancamento, error } = await supabase
    .from("lancamentos")
    .insert({
      data,
      descricao,
      categoria,
      tipo,
      valor,
      registrado_por: sessao?.user?.id ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return converterLancamento(lancamento);
}

export async function atualizarLancamento(id, campos) {
  const { data: lancamento, error } = await supabase
    .from("lancamentos")
    .update({
      data: campos.data,
      descricao: campos.descricao,
      categoria: campos.categoria,
      tipo: campos.tipo,
      valor: campos.valor,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return converterLancamento(lancamento);
}

export async function excluirLancamento(id) {
  const { error } = await supabase.from("lancamentos").delete().eq("id", id);
  if (error) throw error;
}

// Saldo acumulado mês a mês, usado no gráfico de linha do Financeiro.
export async function listarFluxoMensal(meses = 6) {
  const { data: lancamentos, error } = await supabase
    .from("lancamentos")
    .select("data, tipo, valor")
    .order("data", { ascending: true });

  if (error) throw error;

  // Agrupa por mês (YYYY-MM) e acumula o saldo dentro de cada um.
  const porMes = new Map();

  for (const linha of lancamentos ?? []) {
    const chave = linha.data.slice(0, 7);
    const atual = porMes.get(chave) ?? { mes: chave, entradas: 0, saidas: 0 };

    if (linha.tipo === "entrada") atual.entradas += Number(linha.valor);
    else atual.saidas += Number(linha.valor);

    porMes.set(chave, atual);
  }

  const ordenados = [...porMes.values()]
    .sort((a, b) => a.mes.localeCompare(b.mes))
    .slice(-meses);

  // O saldo de cada mês já é a soma de todos os anteriores, então o gráfico
  // mostra a curva e não apenas o movimento do mês isolado.
  let acumulado = 0;
  const fluxo = ordenados.map((item) => {
    acumulado += item.entradas - item.saidas;
    return {
      mes: item.mes,
      rotulo: new Date(`${item.mes}-01T12:00:00`).toLocaleDateString("pt-BR", {
        month: "short",
        year: "2-digit",
      }),
      entradas: item.entradas,
      saidas: item.saidas,
      saldo: acumulado,
    };
  });

  return { fluxo, saldoMaximo: Math.max(...fluxo.map((f) => f.saldo), 0) };
}
