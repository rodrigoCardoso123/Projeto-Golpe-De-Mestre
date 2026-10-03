import { supabase } from "./supabaseClient";

// Configurações institucionais. A tabela é chave/valor, então cada campo da
// tela tem uma chave fixa. Declará-las aqui evita números soltos espalhados
// pelo componente e mantém o valor padrão em um único lugar.

export const CAMPOS = [
  {
    chave: "nome_publico",
    rotulo: "Nome público",
    padrao: "Golpe de Mestre",
    grupo: "Identificação institucional",
    descricao: "Usada no contato, rodapé e módulo de doação.",
  },
  { chave: "razao_social", rotulo: "Razão social", grupo: "Identificação institucional" },
  { chave: "cnpj", rotulo: "CNPJ", grupo: "Identificação institucional" },
  {
    chave: "telefone_institucional",
    rotulo: "Telefone institucional",
    grupo: "Identificação institucional",
  },
  {
    chave: "categorias_financeiras",
    rotulo: "Categorias financeiras",
    grupo: "Identificação institucional",
    multilinha: true,
    padrao: "Doações\nMateriais\nEquipamentos\nTransporte\nEventos",
    descricao: "Uma categoria por linha. Alterar a lista não modifica lançamentos existentes.",
  },

  { chave: "email", rotulo: "E-mail", tipo: "email", grupo: "Canais de contato" },
  { chave: "telefone", rotulo: "Telefone", grupo: "Canais de contato" },
  {
    chave: "whatsapp",
    rotulo: "WhatsApp com país e DDD",
    placeholder: "Ex.: 5511999999999",
    grupo: "Canais de contato",
  },
  { chave: "atendimento", rotulo: "Atendimento", grupo: "Canais de contato" },

  {
    chave: "endereco",
    rotulo: "Endereço",
    grupo: "Endereço",
    largo: true,
  },
  { chave: "cidade", rotulo: "Cidade", grupo: "Endereço" },
  { chave: "uf", rotulo: "Estado / UF", grupo: "Endereço" },
  { chave: "cep", rotulo: "CEP", grupo: "Endereço" },
  { chave: "link_mapa", rotulo: "Link do mapa", grupo: "Endereço" },

  { chave: "instagram", rotulo: "Instagram", grupo: "Redes sociais" },
  { chave: "facebook", rotulo: "Facebook", grupo: "Redes sociais" },
  { chave: "youtube", rotulo: "Youtube", grupo: "Redes sociais" },
  { chave: "tiktok", rotulo: "Tiktok", grupo: "Redes sociais" },

  { chave: "pix_chave", rotulo: "Chave Pix oficial", grupo: "Doações por Pix" },
  {
    chave: "pix_qr_url",
    rotulo: "URL do QR oficial",
    grupo: "Doações por Pix",
    descricao: "Use exclusivamente a chave e o QR Code oficiais.",
  },

  {
    chave: "texto_abertura",
    rotulo: "Texto de abertura",
    grupo: "Conteúdo público",
    multilinha: true,
    padrao: "Disciplina, educação e oportunidade dentro e fora do tatame.",
  },
  { chave: "historia", rotulo: "História aprovada", grupo: "Conteúdo público", multilinha: true },
  {
    chave: "disponibilidade",
    rotulo: "Orientação de disponibilidade",
    grupo: "Conteúdo público",
  },
  {
    chave: "dimensoes_avaliacao",
    rotulo: "Dimensões observadas",
    grupo: "Critérios de avaliação",
    multilinha: true,
    padrao: "Técnica\nPresença\nComportamento\nComprometimento",
    descricao: "Um critério por linha.",
  },
];

// Agrupa os campos na ordem em que aparecem na tela.
export function agruparCampos() {
  const grupos = [];

  for (const campo of CAMPOS) {
    let grupo = grupos.find((item) => item.nome === campo.grupo);

    if (!grupo) {
      grupo = { nome: campo.grupo, descricao: campo.descricao ?? "", campos: [] };
      grupos.push(grupo);
    }

    grupo.campos.push(campo);
  }

  return grupos;
}

export function valorPadrao(chave) {
  return CAMPOS.find((campo) => campo.chave === chave)?.padrao ?? "";
}

// Carrega todas as configurações de uma vez e devolve um objeto chave/valor,
// já com os padrões preenchidos para o que nunca foi salvo.
export async function listarConfiguracoes() {
  const { data, error } = await supabase
    .from("configuracoes")
    .select("chave, valor");

  if (error) throw error;

  const salvas = Object.fromEntries((data ?? []).map((linha) => [linha.chave, linha.valor ?? ""]));

  const resultado = {};

  for (const campo of CAMPOS) {
    resultado[campo.chave] = salvas[campo.chave] ?? valorPadrao(campo.chave);
  }

  return resultado;
}

// Grava apenas as chaves que existem na lista de CAMPOS. Uma chave desconhecida
// recebida por engano é ignorada em vez de criar lixo na tabela.
export async function salvarConfiguracoes(valores) {
  const linhas = CAMPOS.map((campo) => ({
    chave: campo.chave,
    valor: valores[campo.chave] ?? "",
    atualizado_em: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("configuracoes")
    .upsert(linhas, { onConflict: "chave" });

  if (error) throw error;
}
