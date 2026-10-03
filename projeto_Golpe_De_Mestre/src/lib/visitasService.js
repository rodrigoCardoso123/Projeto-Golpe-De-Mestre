import { supabase } from "./supabaseClient";

// Visitas: chegam pelo formulário público da Home e são triadas pela equipe.

function formatarDataBr(iso) {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function rotularSituacao(situacao) {
  if (situacao === "agendada") return "Confirmada";
  if (situacao === "realizada") return "Realizada";
  if (situacao === "cancelada") return "Cancelada";
  return "Solicitada";
}

function converterVisita(linha) {
  return {
    id: linha.id,
    visitante: linha.nome,
    email: linha.email ?? "",
    telefone: linha.telefone ?? "",
    programa: linha.programa ?? "—",
    data: formatarDataBr(linha.data_visita),
    dataIso: linha.data_visita ?? "",
    horario: linha.horario ?? "",
    mensagem: linha.mensagem ?? "",
    situacao: rotularSituacao(linha.situacao),
    situacaoBruta: linha.situacao,
    criadoEm: linha.criado_em,
  };
}

export async function listarVisitas() {
  const { data: visitas, error } = await supabase
    .from("visitas")
    .select("*")
    .order("data_visita", { ascending: true });

  if (error) throw error;
  return (visitas ?? []).map(converterVisita);
}

export async function atualizarVisita(id, campos) {
  const { data: visita, error } = await supabase
    .from("visitas")
    .update({
      nome: campos.visitante,
      email: campos.email || null,
      telefone: campos.telefone || null,
      programa: campos.programa || null,
      data_visita: campos.dataIso || null,
      horario: campos.horario || null,
      mensagem: campos.mensagem || null,
      situacao: campos.situacaoBruta,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return converterVisita(visita);
}

// Atalho para o botão "Confirmar visita": move direto para "agendada".
export async function confirmarVisita(id) {
  return atualizarVisita(id, { situacaoBruta: "agendada" });
}

export async function excluirVisita(id) {
  const { error } = await supabase.from("visitas").delete().eq("id", id);
  if (error) throw error;
}
