-- ============================================================================
-- GOLPE DE MESTRE — Schema completo do banco (Supabase / PostgreSQL)
-- Execute em: Supabase Dashboard > SQL Editor > New query > Run
-- É seguro rodar mais de uma vez (idempotente).
-- ============================================================================

-- ============================================================================
-- 1. ENUMS (tipos de dados com valores fixos usados nas telas)
-- ============================================================================
do $$ begin
  create type public.papel_usuario as enum ('administrador', 'professor', 'responsavel');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.situacao_pessoa as enum ('ativo', 'inativo');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.faixa_jiu_jitsu as enum
    ('branca', 'cinza', 'amarela', 'laranja', 'verde', 'azul', 'roxa', 'marrom', 'preta');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.situacao_inscricao as enum ('analise', 'espera', 'matriculada', 'recusada');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.status_presenca as enum ('presente', 'ausente', 'justificado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.situacao_publicacao as enum ('rascunho', 'publicado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.situacao_solicitacao as enum ('aberta', 'em_andamento', 'resolvida');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.situacao_visita as enum ('solicitada', 'agendada', 'realizada', 'cancelada');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.situacao_doacao as enum ('pendente', 'confirmada');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.tipo_lancamento as enum ('entrada', 'saida');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- 2. PERFIS (estende auth.users — quem loga no sistema)
-- ============================================================================
create table if not exists public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  papel public.papel_usuario not null default 'responsavel',
  situacao public.situacao_pessoa not null default 'ativo',
  telefone text,
  criado_em timestamptz not null default now()
);

-- E-mail do usuário (cópia do auth.users, para exibição e busca na tela de equipe)
alter table public.perfis add column if not exists email text;
create unique index if not exists idx_perfis_email on public.perfis (email);

-- ============================================================================
-- 3. TURMAS
-- ============================================================================
create table if not exists public.turmas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  programa text not null,
  professor_id uuid references public.perfis (id) on delete set null,
  horario text,
  dia_semana text,
  lotacao_maxima int not null default 20,
  situacao public.situacao_pessoa not null default 'ativo',
  criado_em timestamptz not null default now()
);

-- Campos exibidos nos cards da tela de Turmas
alter table public.turmas add column if not exists descricao text;
alter table public.turmas add column if not exists local text;
alter table public.turmas add column if not exists esporte text;

-- ============================================================================
-- 4. ALUNOS
-- ============================================================================
create table if not exists public.alunos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  idade int,
  escola text,
  endereco text,
  nome_mae text,
  nome_pai text,
  telefone text not null,
  turma_id uuid references public.turmas (id) on delete set null,
  faixa public.faixa_jiu_jitsu not null default 'branca',
  graus int not null default 0,
  situacao public.situacao_pessoa not null default 'ativo',
  observacoes text,
  criado_em timestamptz not null default now()
);

-- Vínculo N:N entre responsáveis (perfis) e alunos
create table if not exists public.alunos_responsaveis (
  aluno_id uuid not null references public.alunos (id) on delete cascade,
  responsavel_id uuid not null references public.perfis (id) on delete cascade,
  parentesco text,
  primary key (aluno_id, responsavel_id)
);

-- ============================================================================
-- 5. INSCRIÇÕES (candidatura em análise — ainda não é aluno)
-- ============================================================================
create table if not exists public.inscricoes (
  id uuid primary key default gen_random_uuid(),
  nome_aluno text not null,
  idade int,
  escola text,
  endereco text,
  nome_mae text,
  nome_pai text,
  telefone text not null,
  situacao public.situacao_inscricao not null default 'analise',
  caminho_doc_aluno text,
  caminho_doc_responsavel text,
  criado_em timestamptz not null default now()
);

-- ============================================================================
-- 6. PRESENÇAS
-- ============================================================================
create table if not exists public.presencas (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.alunos (id) on delete cascade,
  turma_id uuid not null references public.turmas (id) on delete cascade,
  data date not null,
  status public.status_presenca not null,
  observacao text,
  registrado_por uuid references public.perfis (id) on delete set null,
  criado_em timestamptz not null default now(),
  unique (aluno_id, turma_id, data)
);

-- ============================================================================
-- 7. GRADUAÇÕES (histórico de faixas e graus)
-- ============================================================================
create table if not exists public.graduacoes (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.alunos (id) on delete cascade,
  faixa public.faixa_jiu_jitsu not null,
  graus int not null default 0,
  data date not null,
  registrado_por uuid references public.perfis (id) on delete set null,
  criado_em timestamptz not null default now()
);

-- ============================================================================
-- 8. DIÁRIO DE AULA
-- ============================================================================
create table if not exists public.aulas_diario (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null references public.turmas (id) on delete cascade,
  data date not null,
  titulo text not null,
  conteudo text,
  registrado_por uuid references public.perfis (id) on delete set null,
  criado_em timestamptz not null default now()
);

-- Situação do encontro: planejada vira realizada quando a aula acontece.
do $$ begin
  create type public.situacao_aula as enum ('planejada', 'realizada');
exception when duplicate_object then null; end $$;

alter table public.aulas_diario add column if not exists situacao public.situacao_aula not null default 'planejada';
alter table public.aulas_diario add column if not exists horario text;
alter table public.aulas_diario add column if not exists objetivos text;

-- ============================================================================
-- 9. ATIVIDADES E COMUNICADOS
-- ============================================================================
create table if not exists public.atividades (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  turma_id uuid references public.turmas (id) on delete set null,
  data date,
  situacao public.situacao_publicacao not null default 'rascunho',
  criado_em timestamptz not null default now()
);

-- Tipo da proposta e prazo de entrega, usados nos cards da tela de Atividades.
alter table public.atividades add column if not exists tipo text not null default 'pratica';
alter table public.atividades add column if not exists prazo date;
alter table public.atividades add column if not exists criado_por uuid references public.perfis (id) on delete set null;

-- Entregas das atividades: uma linha por aluno que entregou.
create table if not exists public.atividade_entregas (
  id uuid primary key default gen_random_uuid(),
  atividade_id uuid not null references public.atividades (id) on delete cascade,
  aluno_id uuid not null references public.alunos (id) on delete cascade,
  entregue_em timestamptz,
  comentario text,
  criado_em timestamptz not null default now(),
  unique (atividade_id, aluno_id)
);

create table if not exists public.comunicados (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  conteudo text not null,
  situacao public.situacao_publicacao not null default 'rascunho',
  criado_por uuid references public.perfis (id) on delete set null,
  criado_em timestamptz not null default now()
);

-- Leitura confirmada por perfil (o botão "Confirmar leitura" da tela).
create table if not exists public.comunicados_leituras (
  id uuid primary key default gen_random_uuid(),
  comunicado_id uuid not null references public.comunicados (id) on delete cascade,
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  lido_em timestamptz not null default now(),
  unique (comunicado_id, perfil_id)
);

-- ============================================================================
-- 10. SOLICITAÇÕES (das famílias)
-- ============================================================================
create table if not exists public.solicitacoes (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid references public.alunos (id) on delete set null,
  responsavel_id uuid references public.perfis (id) on delete set null,
  assunto text not null,
  mensagem text not null,
  situacao public.situacao_solicitacao not null default 'aberta',
  criado_em timestamptz not null default now()
);

-- Resposta da equipe à solicitação, registrada pela tela de Solicitações.
alter table public.solicitacoes add column if not exists resposta text;
alter table public.solicitacoes add column if not exists respondido_em timestamptz;

-- ============================================================================
-- 11. VISITAS (formulário público da Home alimenta esta tabela)
-- ============================================================================
create table if not exists public.visitas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text,
  telefone text,
  data_visita date,
  mensagem text,
  situacao public.situacao_visita not null default 'solicitada',
  criado_em timestamptz not null default now()
);

-- Programa, horário e observações que a tela de Visitas exibe por visita.
alter table public.visitas add column if not exists programa text;
alter table public.visitas add column if not exists horario text;

-- ============================================================================
-- 12. DOAÇÕES / APOIADORES
-- ============================================================================
create table if not exists public.doacoes (
  id uuid primary key default gen_random_uuid(),
  doador text not null,
  email text,
  valor numeric(10, 2) not null,
  data date not null default current_date,
  situacao public.situacao_doacao not null default 'pendente',
  anonima boolean not null default false,
  criado_em timestamptz not null default now()
);

-- Forma de pagamento, recorrência e observação mostradas na tabela da tela.
alter table public.doacoes add column if not exists forma text not null default 'Pix';
alter table public.doacoes add column if not exists recorrente boolean not null default false;
alter table public.doacoes add column if not exists observacao text;

-- ============================================================================
-- 12b. APOIADORES (logos exibidos na prévia pública do site)
-- ============================================================================
create table if not exists public.apoiadores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  categoria text,
  site text,
  caminho_logo text,
  situacao public.situacao_pessoa not null default 'ativo',
  criado_em timestamptz not null default now()
);

-- ============================================================================
-- 13. FINANCEIRO (lançamentos)
-- ============================================================================
create table if not exists public.lancamentos (
  id uuid primary key default gen_random_uuid(),
  data date not null,
  descricao text not null,
  categoria text not null,
  tipo public.tipo_lancamento not null,
  valor numeric(10, 2) not null,
  doacao_id uuid references public.doacoes (id) on delete set null,
  registrado_por uuid references public.perfis (id) on delete set null,
  criado_em timestamptz not null default now()
);

-- ============================================================================
-- 14. NOTIFICAÇÕES (o sino do topo)
-- ============================================================================
create table if not exists public.notificacoes (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  titulo text not null,
  mensagem text,
  lida boolean not null default false,
  criado_em timestamptz not null default now()
);

-- ============================================================================
-- 15. CONFIGURAÇÕES INSTITUCIONAIS (tela Configurações)
-- ============================================================================
create table if not exists public.configuracoes (
  chave text primary key,
  valor text,
  atualizado_em timestamptz not null default now()
);

-- ============================================================================
-- 16. FUNÇÕES AUXILIARES PARA RLS
-- ============================================================================
create or replace function public.papel_atual()
returns public.papel_usuario
language sql
stable
security definer
set search_path = public
as $$
  select papel from public.perfis where id = auth.uid()
$$;

create or replace function public.eh_admin()
returns boolean
language sql
stable
as $$
  select public.papel_atual() = 'administrador'
$$;

create or replace function public.eh_equipe()
returns boolean
language sql
stable
as $$
  select public.papel_atual() in ('administrador', 'professor')
$$;

create or replace function public.eh_responsavel_do(aluno_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.alunos_responsaveis ar
    where ar.aluno_id = eh_responsavel_do.aluno_id and ar.responsavel_id = auth.uid()
  )
$$;

-- ============================================================================
-- 17. TRIGGER: cria perfil automaticamente ao cadastrar usuário no Auth
-- ============================================================================
create or replace function public.criar_perfil_novo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfis (id, nome, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Usuários criados antes desta versão não têm e-mail gravado em perfis
update public.perfis p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil_novo_usuario();

-- ============================================================================
-- 18. RLS — HABILITAR EM TODAS AS TABELAS
-- ============================================================================
alter table public.perfis                  enable row level security;
alter table public.turmas                  enable row level security;
alter table public.alunos                  enable row level security;
alter table public.alunos_responsaveis     enable row level security;
alter table public.inscricoes              enable row level security;
alter table public.presencas               enable row level security;
alter table public.graduacoes              enable row level security;
alter table public.aulas_diario            enable row level security;
alter table public.atividades              enable row level security;
alter table public.comunicados             enable row level security;
alter table public.solicitacoes            enable row level security;
alter table public.visitas                 enable row level security;
alter table public.doacoes                 enable row level security;
alter table public.lancamentos             enable row level security;
alter table public.apoiadores              enable row level security;
alter table public.atividade_entregas      enable row level security;
alter table public.comunicados_leituras    enable row level security;
alter table public.notificacoes            enable row level security;
alter table public.configuracoes           enable row level security;

-- ============================================================================
-- 19. POLÍTICAS RLS
-- ----------------------------------------------------------------------------

-- PERFIS: cada um lê/atualiza o próprio; admin gerencia todos
drop policy if exists "ver_perfil_proprio" on public.perfis;
create policy "ver_perfil_proprio" on public.perfis
  for select to authenticated using (id = auth.uid() or public.eh_admin());

drop policy if exists "atualizar_perfil_proprio" on public.perfis;
create policy "atualizar_perfil_proprio" on public.perfis
  for update to authenticated using (id = auth.uid() or public.eh_admin());

drop policy if exists "admin_cria_perfis" on public.perfis;
create policy "admin_cria_perfis" on public.perfis
  for insert to authenticated with check (public.eh_admin());

-- TURMAS: equipe lê tudo; responsável lê turmas ativas; admin escreve
drop policy if exists "equipe_gerencia_turmas" on public.turmas;
create policy "equipe_gerencia_turmas" on public.turmas
  for all to authenticated
  using (public.eh_equipe()) with check (public.eh_admin());

drop policy if exists "familia_le_turmas_ativas" on public.turmas;
create policy "familia_le_turmas_ativas" on public.turmas
  for select to authenticated using (situacao = 'ativo');

-- ALUNOS: equipe lê todos; responsável lê só os seus; admin escreve
drop policy if exists "equipe_le_alunos" on public.alunos;
create policy "equipe_le_alunos" on public.alunos
  for select to authenticated using (public.eh_equipe() or public.eh_responsavel_do(id));

drop policy if exists "admin_escreve_alunos" on public.alunos;
create policy "admin_escreve_alunos" on public.alunos
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());

-- ALUNOS_RESPONSAVEIS: responsável vê os próprios vínculos; admin gerencia
drop policy if exists "ver_vinculos_proprios" on public.alunos_responsaveis;
create policy "ver_vinculos_proprios" on public.alunos_responsaveis
  for select to authenticated
  using (responsavel_id = auth.uid() or public.eh_admin());

drop policy if exists "admin_gerencia_vinculos" on public.alunos_responsaveis;
create policy "admin_gerencia_vinculos" on public.alunos_responsaveis
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());

-- INSCRIÇÕES: só equipe (dados sensíveis de candidatura)
drop policy if exists "equipe_gerencia_inscricoes" on public.inscricoes;
create policy "equipe_gerencia_inscricoes" on public.inscricoes
  for all to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

-- PRESENÇAS: equipe registra/lê; responsável lê presença dos seus filhos
drop policy if exists "equipe_gerencia_presencas" on public.presencas;
create policy "equipe_gerencia_presencas" on public.presencas
  for all to authenticated
  using (public.eh_equipe()) with check (public.eh_equipe());

drop policy if exists "familia_le_presencas" on public.presencas;
create policy "familia_le_presencas" on public.presencas
  for select to authenticated using (public.eh_responsavel_do(aluno_id));

-- GRADUAÇÕES: equipe gerencia; família lê do próprio aluno
drop policy if exists "equipe_gerencia_graduacoes" on public.graduacoes;
create policy "equipe_gerencia_graduacoes" on public.graduacoes
  for all to authenticated
  using (public.eh_equipe()) with check (public.eh_equipe());

drop policy if exists "familia_le_graduacoes" on public.graduacoes;
create policy "familia_le_graduacoes" on public.graduacoes
  for select to authenticated using (public.eh_responsavel_do(aluno_id));

-- DIÁRIO: equipe gerencia; família lê
drop policy if exists "equipe_gerencia_diario" on public.aulas_diario;
create policy "equipe_gerencia_diario" on public.aulas_diario
  for all to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

drop policy if exists "autenticados_leem_diario" on public.aulas_diario;
create policy "autenticados_leem_diario" on public.aulas_diario
  for select to authenticated using (true);

-- ATIVIDADES: equipe gerencia; todos autenticados leem publicadas
drop policy if exists "equipe_gerencia_atividades" on public.atividades;
create policy "equipe_gerencia_atividades" on public.atividades
  for all to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

drop policy if exists "leem_atividades_publicadas" on public.atividades;
create policy "leem_atividades_publicadas" on public.atividades
  for select to authenticated using (situacao = 'publicado' or public.eh_equipe());

-- COMUNICADOS: equipe gerencia; todos autenticados leem publicados
drop policy if exists "equipe_gerencia_comunicados" on public.comunicados;
create policy "equipe_gerencia_comunicados" on public.comunicados
  for all to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

drop policy if exists "leem_comunicados_publicados" on public.comunicados;
create policy "leem_comunicados_publicados" on public.comunicados
  for select to authenticated using (situacao = 'publicado' or public.eh_equipe());

-- SOLICITAÇÕES: família cria e vê as suas; equipe gerencia todas
drop policy if exists "familia_cria_solicitacao" on public.solicitacoes;
create policy "familia_cria_solicitacao" on public.solicitacoes
  for insert to authenticated with check (responsavel_id = auth.uid());

drop policy if exists "ver_solicitacoes" on public.solicitacoes;
create policy "ver_solicitacoes" on public.solicitacoes
  for select to authenticated
  using (responsavel_id = auth.uid() or public.eh_equipe());

drop policy if exists "equipe_gerencia_solicitacoes" on public.solicitacoes;
create policy "equipe_gerencia_solicitacoes" on public.solicitacoes
  for update to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

-- VISITAS: público envia (formulário da Home); equipe lê/gerencia
drop policy if exists "publico_envia_visita" on public.visitas;
create policy "publico_envia_visita" on public.visitas
  for insert to anon with check (true);

drop policy if exists "equipe_gerencia_visitas" on public.visitas;
create policy "equipe_gerencia_visitas" on public.visitas
  for all to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

-- DOAÇÕES: só administrador (dados financeiros)
drop policy if exists "admin_gerencia_doacoes" on public.doacoes;
create policy "admin_gerencia_doacoes" on public.doacoes
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());

-- LANÇAMENTOS: só administrador (dados financeiros)
drop policy if exists "admin_gerencia_lancamentos" on public.lancamentos;
create policy "admin_gerencia_lancamentos" on public.lancamentos
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());

-- ATIVIDADE_ENTREGAS: equipe gerencia; responsável vê as dos próprios alunos
drop policy if exists "equipe_gerencia_entregas" on public.atividade_entregas;
create policy "equipe_gerencia_entregas" on public.atividade_entregas
  for all to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

drop policy if exists "familia_le_entregas" on public.atividade_entregas;
create policy "familia_le_entregas" on public.atividade_entregas
  for select to authenticated using (public.eh_responsavel_do(aluno_id));

-- COMUNICADOS_LEITURAS: cada um confirma a própria leitura; equipe vê todas
drop policy if exists "propria_confirma_leitura" on public.comunicados_leituras;
create policy "propria_confirma_leitura" on public.comunicados_leituras
  for insert to authenticated with check (perfil_id = auth.uid());

drop policy if exists "ver_leituras" on public.comunicados_leituras;
create policy "ver_leituras" on public.comunicados_leituras
  for select to authenticated using (public.eh_equipe() or perfil_id = auth.uid());

-- APOIADORES: equipe gerencia; o público lê os ativos (prévia do site)
drop policy if exists "equipe_gerencia_apoiadores" on public.apoiadores;
create policy "equipe_gerencia_apoiadores" on public.apoiadores
  for all to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

drop policy if exists "publico_le_apoiadores_ativos" on public.apoiadores;
create policy "publico_le_apoiadores_ativos" on public.apoiadores
  for select to anon, authenticated using (situacao = 'ativo');

-- NOTIFICAÇÕES: cada perfil vê e marca as suas
drop policy if exists "ver_notificacoes_proprias" on public.notificacoes;
create policy "ver_notificacoes_proprias" on public.notificacoes
  for select to authenticated using (perfil_id = auth.uid());

drop policy if exists "atualizar_notificacoes_proprias" on public.notificacoes;
create policy "atualizar_notificacoes_proprias" on public.notificacoes
  for update to authenticated using (perfil_id = auth.uid());

-- CONFIGURAÇÕES: todos autenticados leem; só admin escreve
drop policy if exists "autenticados_leem_config" on public.configuracoes;
create policy "autenticados_leem_config" on public.configuracoes
  for select to authenticated using (true);

drop policy if exists "admin_gerencia_config" on public.configuracoes;
create policy "admin_gerencia_config" on public.configuracoes
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());

-- ============================================================================
-- 20. STORAGE — bucket de documentos de alunos
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('documentos-alunos', 'documentos-alunos', false)
on conflict (id) do nothing;

-- Bucket público dos logos dos apoiadores: a prévia do site precisa exibi-los
-- sem autenticação, por isso public = true.
insert into storage.buckets (id, name, public)
values ('apoiadores-logos', 'apoiadores-logos', true)
on conflict (id) do nothing;

drop policy if exists "equipe_gerencia_logos_apoiadores" on storage.objects;
create policy "equipe_gerencia_logos_apoiadores" on storage.objects
  for all to authenticated
  using (bucket_id = 'apoiadores-logos' and public.eh_equipe())
  with check (bucket_id = 'apoiadores-logos' and public.eh_equipe());

-- Equipe gerencia os documentos do bucket
drop policy if exists "equipe_gerencia_documentos" on storage.objects;
create policy "equipe_gerencia_documentos" on storage.objects
  for all to authenticated
  using (bucket_id = 'documentos-alunos' and public.eh_equipe())
  with check (bucket_id = 'documentos-alunos' and public.eh_equipe());

-- Extrai o id do aluno do caminho do objeto ({aluno_id}/arquivo.pdf).
-- Retorna null quando o caminho não começa com um uuid válido, para a policy
-- simplesmente negar o acesso em vez de quebrar com erro de cast.
create or replace function public.aluno_id_do_caminho(nome text)
returns uuid
language plpgsql
stable
as $$
begin
  return split_part(nome, '/', 1)::uuid;
exception when others then
  return null;
end;
$$;

-- Responsável lê apenas documentos dos próprios alunos
-- (caminho padrão: {aluno_id}/arquivo.pdf)
drop policy if exists "familia_le_documentos" on storage.objects;
create policy "familia_le_documentos" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'documentos-alunos'
    and public.eh_responsavel_do(public.aluno_id_do_caminho(storage.objects.name))
  );

-- ============================================================================
-- 21. ÍNDICES
-- ============================================================================
create index if not exists idx_alunos_turma on public.alunos (turma_id);
create index if not exists idx_alunos_situacao on public.alunos (situacao);
create index if not exists idx_presencas_data on public.presencas (data);
create index if not exists idx_presencas_aluno on public.presencas (aluno_id);
create index if not exists idx_lancamentos_data on public.lancamentos (data);
create index if not exists idx_doacoes_situacao on public.doacoes (situacao);
create index if not exists idx_inscricoes_situacao on public.inscricoes (situacao);
create index if not exists idx_notificacoes_perfil on public.notificacoes (perfil_id, lida);
create index if not exists idx_aulas_diario_data on public.aulas_diario (data desc);
create index if not exists idx_atividades_turma on public.atividades (turma_id);
create index if not exists idx_atividade_entregas_atividade on public.atividade_entregas (atividade_id);
create index if not exists idx_comunicados_leituras_comunicado on public.comunicados_leituras (comunicado_id);
create index if not exists idx_solicitacoes_situacao on public.solicitacoes (situacao);
create index if not exists idx_visitas_data on public.visitas (data_visita);
create index if not exists idx_apoiadores_situacao on public.apoiadores (situacao);

-- ============================================================================
-- 22. GESTÃO DE ACESSOS — criação de contas pela tela de Equipe e Acesso
-- ============================================================================
-- Cria uma conta JÁ VERIFICADA no Auth (email_confirmed_at preenchido), para
-- que o administrador possa cadastrar a equipe direto pelo painel, sem precisar
-- de confirmar e-mail um por um.
--
-- Segurança:
--  - só quem tem papel 'administrador' consegue executar (validado dentro da função)
--  - SECURITY DEFINER + search_path fixo: a função roda com permissão do dono,
--    mas o search_path travado impede que alguém_redirect para outra tabela
--  - a senha nunca passa pelo navegador em claro até o hash gerado aqui
-- ============================================================================
create or replace function public.criar_usuario_acesso(
  email_criado text,
  senha_criada text,
  nome_criado text,
  papel_criado public.papel_usuario default 'responsavel'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  novo_id uuid;
begin
  -- 1. Somente administrador entra aqui
  if not public.eh_admin() then
    raise exception 'Sem permissão: apenas administradores podem criar acessos.'
      using errcode = '42501';
  end if;

  -- 2. Validações básicas
  if email_criado is null or position('@' in email_criado) = 0 then
    raise exception 'E-mail inválido.'
      using errcode = '22023';
  end if;

  if senha_criada is null or length(senha_criada) < 6 then
    raise exception 'A senha deve ter no mínimo 6 caracteres.'
      using errcode = '22023';
  end if;

  -- 3. E-mail já existe?
  if exists (select 1 from auth.users where email = lower(trim(email_criado))) then
    raise exception 'Já existe uma conta com este e-mail.'
      using errcode = '23505';
  end if;

  -- 4. Grava no Auth com a senha já criptografada e o e-mail confirmado
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    lower(trim(email_criado)),
    crypt(senha_criada, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('nome', nome_criado),
    now(),
    now()
  )
  returning id into novo_id;

  -- 5. O trigger já cria a linha em perfis, mas garantimos papel e nome corretos
  insert into public.perfis (id, nome, email, papel, situacao)
  values (novo_id, nome_criado, lower(trim(email_criado)), papel_criado, 'ativo')
  on conflict (id) do update
    set nome = excluded.nome,
        papel = excluded.papel,
        situacao = 'ativo';

  return novo_id;
end;
$$;

-- A função fica restrita a usuários autenticados; o check de admin é interno.
revoke all on function public.criar_usuario_acesso(text, text, text, public.papel_usuario) from public;
grant execute on function public.criar_usuario_acesso(text, text, text, public.papel_usuario) to authenticated;

-- ============================================================================
-- FIM — schema pronto!
-- ============================================================================
