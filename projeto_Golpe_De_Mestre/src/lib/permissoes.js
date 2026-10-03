// Mapa de permissões por cargo.
//
// Cada área do painel declara quais cargos a acessam. Um mesmo cargo pode
// entrar por várias rotas, e uma rota pode aceitar mais de um cargo.
//
// O filtro do menu e a guarda das rotas usam ESTE arquivo como fonte única,
// para que nunca aconteça de uma tela estar escondida no menu e aberta na URL.
export const PERMISSOES = {
  visaoGeral: ["administrador", "professor", "responsavel"],

  inscricoes: ["administrador", "professor"],
  novaInscricao: ["administrador"],
  alunos: ["administrador", "professor", "responsavel"],
  novoAluno: ["administrador"],
  editarAluno: ["administrador", "professor"],
  turmas: ["administrador", "professor", "responsavel"],
  novaTurma: ["administrador"],
  editarTurma: ["administrador", "professor"],
  diario: ["administrador", "professor", "responsavel"],
  presenca: ["administrador", "professor", "responsavel"],
  desenvolvimento: ["administrador", "professor"],
  atividades: ["administrador", "professor"],
  comunicados: ["administrador", "professor", "responsavel"],
  solicitacoes: ["administrador", "professor", "responsavel"],
  relatorios: ["administrador", "professor"],
  visitas: ["administrador"],
  doacoes: ["administrador"],
  financeiro: ["administrador"],
  apoiadores: ["administrador"],
  equipe: ["administrador"],
  novoAcesso: ["administrador"],
  configuracoes: ["administrador"],
};

const ROTULO_CARGO = {
  administrador: "Administrador",
  professor: "Professor",
  responsavel: "Responsável",
};

export function rotuloCargo(cargo) {
  return ROTULO_CARGO[cargo] ?? "—";
}

export function podeAcessar(cargo, area) {
  const permitidos = PERMISSOES[area];
  if (!permitidos) return false;
  return permitidos.includes(cargo);
}

export function ehEquipe(cargo) {
  return cargo === "administrador" || cargo === "professor";
}

export function ehAdmin(cargo) {
  return cargo === "administrador";
}