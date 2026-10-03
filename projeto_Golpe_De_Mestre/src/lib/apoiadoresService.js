import { supabase } from "./supabaseClient";

// Apoiadores: os logos exibidos na prévia pública do site.

function converterApoiador(linha) {
  return {
    id: linha.id,
    nome: linha.nome,
    categoria: linha.categoria ?? "—",
    site: linha.site ?? "",
    caminhoLogo: linha.caminho_logo ?? "",
    situacao: linha.situacao === "ativo" ? "Ativo" : "Inativo",
    situacaoBruta: linha.situacao,
    criadoEm: linha.criado_em,
  };
}

export async function listarApoiadores() {
  const { data, error } = await supabase
    .from("apoiadores")
    .select("*")
    .order("nome");

  if (error) throw error;
  return (data ?? []).map(converterApoiador);
}

export async function criarApoiador({ nome, categoria, site, caminhoLogo }) {
  const { data: apoiador, error } = await supabase
    .from("apoiadores")
    .insert({ nome, categoria, site: site || null, caminho_logo: caminhoLogo || null })
    .select("*")
    .single();

  if (error) throw error;
  return converterApoiador(apoiador);
}

export async function atualizarApoiador(id, campos) {
  const { data: apoiador, error } = await supabase
    .from("apoiadores")
    .update({
      nome: campos.nome,
      categoria: campos.categoria,
      site: campos.site || null,
      caminho_logo: campos.caminhoLogo || null,
      situacao: campos.situacao === "Inativo" ? "inativo" : "ativo",
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return converterApoiador(apoiador);
}

// Remove o apoiador e o arquivo correspondente do bucket, para não deixar lixo.
export async function excluirApoiador(id, caminhoLogo) {
  if (caminhoLogo) {
    const { error: erroStorage } = await supabase.storage
      .from("apoiadores-logos")
      .remove([caminhoLogo]);

    // Falha no storage não impede a exclusão do registro: o registro é a fonte.
    if (erroStorage) console.warn("Logo não removido:", erroStorage.message);
  }

  const { error } = await supabase.from("apoiadores").delete().eq("id", id);
  if (error) throw error;
}

// Envia o logo para o bucket e devolve o caminho público.
export async function enviarLogo(arquivo) {
  const extensao = arquivo.name.split(".").pop()?.toLowerCase() ?? "png";
  const caminho = `${crypto.randomUUID()}.${extensao}`;

  const { error } = await supabase.storage
    .from("apoiadores-logos")
    .upload(caminho, arquivo, { contentType: arquivo.type, upsert: false });

  if (error) throw error;
  return caminho;
}

export async function urlPublicaLogo(caminhoLogo) {
  if (!caminhoLogo) return "";
  const { data } = await supabase.storage.from("apoiadores-logos").getPublicUrl(caminhoLogo);
  return data?.publicUrl ?? "";
}

// ============================================================================
// DOAÇÕES
// ============================================================================

const FORMAS = ["Pix", "Transferência", "Dinheiro", "Cartão", "Outro"];

export function formasDoacao() {
  return FORMAS;
}

function formatarDataBr(iso) {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function converterDoacao(linha) {
  return {
    id: linha.id,
    doador: linha.doador,
    email: linha.email ?? "",
    valor: Number(linha.valor),
    data: formatarDataBr(linha.data),
    dataIso: linha.data,
    forma: linha.forma ?? "Pix",
    recorrente: linha.recorrente ?? false,
    observacao: linha.observacao ?? "",
    anonima: linha.anonima ?? false,
    situacao: linha.situacao === "confirmada" ? "Confirmada" : "Pendente",
    situacaoBruta: linha.situacao,
  };
}

export async function listarDoacoes() {
  const { data, error } = await supabase
    .from("doacoes")
    .select("*")
    .order("data", { ascending: false });

  if (error) throw error;

  const doacoes = (data ?? []).map(converterDoacao);

  return {
    doacoes,
    total: doacoes.reduce((soma, d) => soma + d.valor, 0),
    totalConfirmadas: doacoes
      .filter((d) => d.situacaoBruta === "confirmada")
      .reduce((soma, d) => soma + d.valor, 0),
  };
}

export async function registrarDoacao({ doador, email, valor, data, forma, recorrente, observacao, anonima }) {
  const { data: doacao, error } = await supabase
    .from("doacoes")
    .insert({
      doador: anonima ? "Anônimo" : doador,
      email: anonima ? null : email || null,
      valor,
      data,
      forma,
      recorrente,
      observacao: observacao || null,
      anonima,
      situacao: "pendente",
    })
    .select("*")
    .single();

  if (error) throw error;
  return converterDoacao(doacao);
}

// Confirma a doação e, se ela ainda não tiver lançamento no financeiro,
// cria a entrada correspondente para que o saldo feche.
export async function confirmarDoacao(id) {
  const { data: doacao, error } = await supabase
    .from("doacoes")
    .update({ situacao: "confirmada" })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;

  const { data: lancamento } = await supabase
    .from("lancamentos")
    .select("id")
    .eq("doacao_id", id)
    .maybeSingle();

  if (!lancamento) {
    const { data: sessao } = await supabase.auth.getSession();

    await supabase.from("lancamentos").insert({
      data: doacao.data,
      descricao: `Doação — ${doacao.doador}`,
      categoria: "Doações",
      tipo: "entrada",
      valor: doacao.valor,
      doacao_id: doacao.id,
      registrado_por: sessao?.user?.id ?? null,
    });
  }

  return converterDoacao(doacao);
}

export async function atualizarDoacao(id, campos) {
  const { data: doacao, error } = await supabase
    .from("doacoes")
    .update({
      doador: campos.anonima ? "Anônimo" : campos.doador,
      valor: campos.valor,
      data: campos.data,
      forma: campos.forma,
      recorrente: campos.recorrente,
      observacao: campos.observacao || null,
      anonima: campos.anonima,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return converterDoacao(doacao);
}

export async function excluirDoacao(id) {
  const { error } = await supabase.from("doacoes").delete().eq("id", id);
  if (error) throw error;
}
