-- Promove um usuário a administrador.
-- Troque o e-mail abaixo pelo seu e rode no Supabase Dashboard > SQL Editor > Run.

update public.perfis
set papel = 'administrador'
where email = 'SEU_EMAIL_AQUI@gmail.com';

-- Confere o resultado (deve aparecer o seu e-mail com papel administrador)
select
  email,
  nome,
  papel,
  situacao,
  criado_em
from public.perfis
order by criado_em desc;

-- Se o e-mail não aparecer acima, o usuário ainda não foi criado no Auth.
-- Crie em: Authentication > Users > Add user (marque "Auto Confirm User").