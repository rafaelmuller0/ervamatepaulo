-- Gestão de devedores: execute esta migration no projeto Supabase vinculado ao app.
create extension if not exists pgcrypto;

create table if not exists public.devedores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  telefone text not null default '',
  endereco text not null default '',
  observacoes text not null default '',
  criado_em timestamptz not null default now()
);

create index if not exists devedores_user_nome_idx on public.devedores(user_id, nome);

create table if not exists public.dividas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  devedor_id uuid not null references public.devedores(id) on delete restrict,
  descricao text not null,
  valor_original numeric(12,2) not null check (valor_original > 0),
  saldo numeric(12,2) not null check (saldo >= 0),
  data_vencimento date not null,
  status text not null default 'aberta' check (status in ('aberta','quitada')),
  criado_em timestamptz not null default now()
);

create index if not exists dividas_user_vencimento_idx on public.dividas(user_id, data_vencimento);
create index if not exists dividas_devedor_idx on public.dividas(devedor_id);

create table if not exists public.pagamentos_dividas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  divida_id uuid not null references public.dividas(id) on delete cascade,
  valor numeric(12,2) not null check (valor > 0),
  observacao text not null default '',
  pago_em timestamptz not null default now()
);

create index if not exists pagamentos_dividas_divida_idx on public.pagamentos_dividas(divida_id, pago_em desc);

alter table public.devedores enable row level security;
alter table public.dividas enable row level security;
alter table public.pagamentos_dividas enable row level security;

create policy "Users manage their own debtors"
  on public.devedores for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Users manage their own debts"
  on public.dividas for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Users read and create their own debt payments"
  on public.pagamentos_dividas for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.registrar_pagamento_divida(
  p_divida_id uuid,
  p_valor numeric,
  p_observacao text default ''
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_divida public.dividas%rowtype;
begin
  if auth.uid() is null then
    raise exception 'É necessário estar autenticado.';
  end if;
  if p_valor is null or p_valor <= 0 then
    raise exception 'O valor do pagamento deve ser maior que zero.';
  end if;

  select * into v_divida
  from public.dividas
  where id = p_divida_id and user_id = auth.uid()
  for update;

  if not found then
    raise exception 'Dívida não encontrada.';
  end if;
  if p_valor > v_divida.saldo then
    raise exception 'O pagamento não pode ser maior que o saldo pendente.';
  end if;

  insert into public.pagamentos_dividas(user_id, divida_id, valor, observacao)
  values (auth.uid(), p_divida_id, p_valor, coalesce(p_observacao, ''));

  update public.dividas
  set saldo = round(saldo - p_valor, 2),
      status = case when round(saldo - p_valor, 2) <= 0 then 'quitada' else 'aberta' end
  where id = p_divida_id and user_id = auth.uid();
end;
$$;

revoke all on function public.registrar_pagamento_divida(uuid, numeric, text) from public;
grant execute on function public.registrar_pagamento_divida(uuid, numeric, text) to authenticated;
