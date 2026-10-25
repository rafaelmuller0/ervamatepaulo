create table public.produtos(id uuid primary key default gen_random_uuid(),user_id uuid not null,nome text not null check(length(trim(nome))>0),categoria text not null default 'Erva-mate',preco_custo numeric(12,2) not null default 0 check(preco_custo>=0),preco_venda numeric(12,2) not null default 0 check(preco_venda>=0),estoque integer not null default 0 check(estoque>=0),estoque_minimo integer not null default 0 check(estoque_minimo>=0),descricao text not null default '',criado_em timestamptz not null default now());
create table public.vendas(id uuid primary key default gen_random_uuid(),user_id uuid not null,produto_id uuid not null references public.produtos(id) on delete restrict,quantidade integer not null check(quantidade>0),desconto numeric(12,2) not null default 0 check(desconto>=0),forma_pagamento text not null check(forma_pagamento in ('Dinheiro','Pix','Cartão de Crédito','Cartão de Débito')),cliente text,data_venda timestamptz not null default now(),valor_bruto numeric(12,2) not null check(valor_bruto>=0),valor_liquido numeric(12,2) not null check(valor_liquido>=0 and valor_liquido<=valor_bruto),custo_total numeric(12,2) not null check(custo_total>=0));
create table public.configuracoes(id uuid primary key default gen_random_uuid(),user_id uuid not null unique,nome_empresa text not null default 'Gestão Erva Mate Paulo',tema text not null default 'light' check(tema in ('light','dark')),criado_em timestamptz not null default now());
grant select,insert,update,delete on public.produtos,public.vendas,public.configuracoes to authenticated;
grant all on public.produtos,public.vendas,public.configuracoes to service_role;
create index produtos_user_idx on public.produtos(user_id); create index vendas_user_data_idx on public.vendas(user_id,data_venda desc);
alter table public.produtos enable row level security; alter table public.vendas enable row level security; alter table public.configuracoes enable row level security;
create policy "user products" on public.produtos for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "user sales" on public.vendas for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid() and exists(select 1 from public.produtos p where p.id=produto_id and p.user_id=auth.uid()));
create policy "user settings" on public.configuracoes for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create or replace function public.aplicar_estoque_venda() returns trigger language plpgsql security invoker set search_path=public as $$
declare pid uuid; delta integer; uid uuid; atual integer;
begin
 if TG_OP='INSERT' then pid:=NEW.produto_id;delta:=-NEW.quantidade;uid:=NEW.user_id;
 elsif TG_OP='DELETE' then pid:=OLD.produto_id;delta:=OLD.quantidade;uid:=OLD.user_id;
 else
  if OLD.produto_id=NEW.produto_id then pid:=NEW.produto_id;delta:=OLD.quantidade-NEW.quantidade;
  else update public.produtos set estoque=estoque+OLD.quantidade where id=OLD.produto_id and user_id=OLD.user_id;pid:=NEW.produto_id;delta:=-NEW.quantidade;end if;uid:=NEW.user_id;
 end if;
 if TG_OP<>'DELETE' and not exists(select 1 from public.produtos where id=NEW.produto_id and user_id=NEW.user_id) then raise exception 'Produto não pertence a esta conta.';end if;
 if TG_OP<>'DELETE' and delta<0 then select estoque into atual from public.produtos where id=pid and user_id=uid for update;if atual is null or atual < -delta then raise exception 'Estoque insuficiente.';end if;end if;
 update public.produtos set estoque=estoque+delta where id=pid and user_id=uid;if not found then raise exception 'Produto não encontrado.';end if;
 if TG_OP='DELETE' then return OLD;else return NEW;end if;
end $$;
create trigger trg_venda_estoque before insert or update or delete on public.vendas for each row execute function public.aplicar_estoque_venda();
create or replace function public.criar_config_usuario() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.configuracoes(user_id) values(NEW.id) on conflict(user_id) do nothing;return NEW;end $$;
revoke execute on function public.criar_config_usuario() from public, anon, authenticated;
create trigger trg_user_config after insert on auth.users for each row execute function public.criar_config_usuario();