
-- Atlas Delivery initial schema. Run once in Supabase SQL editor.
create extension if not exists pgcrypto;
create type public.app_role as enum ('super_admin','admin','manager','dispatcher','warehouse','driver','merchant','accountant');
create type public.shipment_status as enum ('created','confirmed','pickup_scheduled','picked_up','in_transit','out_for_delivery','delivered','refused','returned','cancelled');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 2 and 150),
  created_at timestamptz not null default now()
);
create table public.merchants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  name text not null, phone text not null default '', city text not null default '',
  default_fee_mad numeric(12,2) not null default 30 check (default_fee_mad >= 0),
  active boolean not null default true, created_at timestamptz not null default now(),
  unique(organization_id,id)
);
create table public.drivers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  full_name text not null, phone text not null default '', city text not null default '',
  active boolean not null default true, created_at timestamptz not null default now(),
  unique(organization_id,id)
);
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id),
  full_name text not null,
  role public.app_role not null,
  merchant_id uuid,
  driver_id uuid,
  created_at timestamptz not null default now(),
  foreign key (organization_id,merchant_id) references public.merchants(organization_id,id),
  foreign key (organization_id,driver_id) references public.drivers(organization_id,id),
  constraint correct_role_link check (
    (role <> 'merchant' or (merchant_id is not null and driver_id is null))
    and (role <> 'driver' or (driver_id is not null and merchant_id is null))
  )
);
create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  tracking_code text not null unique default ('AT-' || upper(encode(gen_random_bytes(10),'hex'))),
  merchant_id uuid not null,
  driver_id uuid,
  recipient_name text not null check(length(recipient_name) between 2 and 100),
  recipient_phone text not null,
  destination_city text not null,
  delivery_address text not null,
  notes text not null default '',
  cod_amount_mad numeric(12,2) not null default 0 check(cod_amount_mad >= 0),
  delivery_fee_mad numeric(12,2) not null default 30 check(delivery_fee_mad >= 0),
  status public.shipment_status not null default 'created',
  cash_received_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  delivered_at timestamptz,
  foreign key(organization_id,merchant_id) references public.merchants(organization_id,id),
  foreign key(organization_id,driver_id) references public.drivers(organization_id,id),
  unique(organization_id,id)
);
create index shipments_org_created_idx on public.shipments (organization_id,created_at desc);
create index shipments_org_status_idx on public.shipments (organization_id,status);
create index shipments_driver_idx on public.shipments (driver_id,status);
create index shipments_merchant_idx on public.shipments (merchant_id,created_at desc);

create table public.shipment_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  shipment_id uuid not null references public.shipments(id),
  from_status public.shipment_status,
  to_status public.shipment_status not null,
  comment text not null default '',
  actor_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index shipment_events_shipment_idx on public.shipment_events(shipment_id,created_at desc);
create table public.products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  merchant_id uuid not null,
  sku text not null,
  name text not null,
  quantity integer not null default 0 check (quantity >= 0),
  low_stock_threshold integer not null default 10 check (low_stock_threshold >= 0),
  created_at timestamptz not null default now(),
  foreign key(organization_id,merchant_id) references public.merchants(organization_id,id),
  unique(organization_id,merchant_id,sku),
  unique(organization_id,id)
);
create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  product_id uuid not null,
  quantity_change integer not null check(quantity_change <> 0),
  reason text not null,
  actor_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  foreign key(organization_id,product_id) references public.products(organization_id,id)
);
create table public.settlements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  merchant_id uuid not null,
  total_cod_mad numeric(12,2) not null default 0,
  total_fees_mad numeric(12,2) not null default 0,
  net_mad numeric(12,2) not null default 0,
  status text not null default 'pending' check(status in ('pending','paid')),
  payment_reference text,
  paid_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  foreign key(organization_id,merchant_id) references public.merchants(organization_id,id),
  unique(organization_id,id)
);
create table public.settlement_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  settlement_id uuid not null,
  shipment_id uuid not null unique references public.shipments(id),
  cod_mad numeric(12,2) not null,
  fee_mad numeric(12,2) not null,
  foreign key(organization_id,settlement_id) references public.settlements(organization_id,id)
);
create table public.audit_logs (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  actor_id uuid references auth.users(id),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_logs_org_idx on public.audit_logs(organization_id,created_at desc);

-- SECURITY DEFINER accessors avoid recursive RLS on profiles.
create or replace function public.app_org_id() returns uuid language sql stable security definer set search_path=public as $$
  select organization_id from public.profiles where id=auth.uid() limit 1
$$;
create or replace function public.app_role() returns public.app_role language sql stable security definer set search_path=public as $$
  select role from public.profiles where id=auth.uid() limit 1
$$;
create or replace function public.app_merchant_id() returns uuid language sql stable security definer set search_path=public as $$
  select merchant_id from public.profiles where id=auth.uid() limit 1
$$;
create or replace function public.app_driver_id() returns uuid language sql stable security definer set search_path=public as $$
  select driver_id from public.profiles where id=auth.uid() limit 1
$$;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.merchants enable row level security;
alter table public.drivers enable row level security;
alter table public.shipments enable row level security;
alter table public.shipment_events enable row level security;
alter table public.products enable row level security;
alter table public.stock_movements enable row level security;
alter table public.settlements enable row level security;
alter table public.settlement_items enable row level security;
alter table public.audit_logs enable row level security;

create policy organizations_read on public.organizations for select to authenticated
  using (id=public.app_org_id());
create policy profiles_read on public.profiles for select to authenticated
  using (organization_id=public.app_org_id() and
    (id=auth.uid() or public.app_role() in ('super_admin','admin','manager')));
create policy merchants_read on public.merchants for select to authenticated
  using (organization_id=public.app_org_id() and
    (public.app_role() in ('super_admin','admin','manager','dispatcher','warehouse','accountant')
       or id=public.app_merchant_id()));
create policy merchants_insert on public.merchants for insert to authenticated
  with check(organization_id=public.app_org_id() and public.app_role() in ('super_admin','admin','manager'));
create policy drivers_read on public.drivers for select to authenticated
  using (organization_id=public.app_org_id() and
    (public.app_role() in ('super_admin','admin','manager','dispatcher','warehouse','accountant')
       or id=public.app_driver_id()));
create policy drivers_insert on public.drivers for insert to authenticated
  with check(organization_id=public.app_org_id() and public.app_role() in ('super_admin','admin','manager','dispatcher'));
create policy shipments_read on public.shipments for select to authenticated
  using (organization_id=public.app_org_id() and (
    public.app_role() in ('super_admin','admin','manager','dispatcher','warehouse','accountant')
    or merchant_id=public.app_merchant_id() or driver_id=public.app_driver_id()
  ));
create policy shipments_insert on public.shipments for insert to authenticated
  with check(organization_id=public.app_org_id() and created_by=auth.uid()
    and status='created' and driver_id is null and cash_received_at is null
    and (
      public.app_role() in ('super_admin','admin','manager','dispatcher')
      or (public.app_role()='merchant' and merchant_id=public.app_merchant_id()
        and delivery_fee_mad=(select default_fee_mad from public.merchants where id=merchant_id and organization_id=public.app_org_id()))
    ));
create policy events_read on public.shipment_events for select to authenticated
  using (organization_id=public.app_org_id()
  and exists(select 1 from public.shipments s where s.id=shipment_id));
create policy products_read on public.products for select to authenticated
  using (organization_id=public.app_org_id() and
    (public.app_role() in ('super_admin','admin','manager','dispatcher','warehouse','accountant')
      or merchant_id=public.app_merchant_id()));
create policy products_insert on public.products for insert to authenticated
  with check(organization_id=public.app_org_id() and public.app_role() in ('super_admin','admin','manager','warehouse'));
create policy movements_read on public.stock_movements for select to authenticated
  using(organization_id=public.app_org_id() and public.app_role() in ('super_admin','admin','manager','warehouse','accountant'));
create policy settlements_read on public.settlements for select to authenticated
  using(organization_id=public.app_org_id() and (public.app_role() in ('super_admin','admin','manager','accountant') or merchant_id=public.app_merchant_id()));
create policy settlement_items_read on public.settlement_items for select to authenticated
  using(organization_id=public.app_org_id() and exists(
    select 1 from public.settlements s where s.id=settlement_id));
create policy audit_read on public.audit_logs for select to authenticated
  using(organization_id=public.app_org_id() and public.app_role() in ('super_admin','admin','manager'));

-- Only RPCs, never direct UPDATE, may mutate custody, cash, stock or settlements.
create or replace function public.log_new_shipment() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  insert into public.shipment_events(organization_id,shipment_id,from_status,to_status,comment,actor_id)
  values(new.organization_id,new.id,null,'created','Colis créé',new.created_by);
  return new;
end $$;
create trigger shipment_created after insert on public.shipments for each row execute function public.log_new_shipment();

create or replace function public.change_shipment_status(p_shipment_id uuid,p_new_status public.shipment_status,p_comment text default '')
returns void language plpgsql security definer set search_path=public as $$
declare s public.shipments%rowtype; r public.app_role;
begin
  r:=public.app_role();
  select * into s from public.shipments where id=p_shipment_id for update;
  if not found or s.organization_id is distinct from public.app_org_id() then
    raise exception 'Shipment not found' using errcode='P0002';
  end if;
  if r not in ('super_admin','admin','manager','dispatcher','warehouse','driver') then raise exception 'Not authorized'; end if;
  if r='driver' and (s.driver_id is distinct from public.app_driver_id() or
      s.status <> 'out_for_delivery' or p_new_status not in ('delivered','refused')) then
    raise exception 'Driver not authorized for this transition';
  end if;
  if not (
    (s.status='created' and p_new_status in ('confirmed','cancelled')) or
    (s.status='confirmed' and p_new_status in ('pickup_scheduled','picked_up','cancelled')) or
    (s.status='pickup_scheduled' and p_new_status in ('picked_up','cancelled')) or
    (s.status='picked_up' and p_new_status in ('in_transit','returned')) or
    (s.status='in_transit' and p_new_status in ('out_for_delivery','returned')) or
    (s.status='out_for_delivery' and p_new_status in ('delivered','refused','in_transit')) or
    (s.status='refused' and p_new_status='returned')
  ) then raise exception 'Invalid status transition'; end if;
  update public.shipments set status=p_new_status,updated_at=now(),
    delivered_at=case when p_new_status='delivered' then now() else delivered_at end where id=s.id;
  insert into public.shipment_events(organization_id,shipment_id,from_status,to_status,comment,actor_id)
    values(s.organization_id,s.id,s.status,p_new_status,left(coalesce(p_comment,''),500),auth.uid());
  insert into public.audit_logs(organization_id,entity_type,entity_id,action,actor_id,details)
    values(s.organization_id,'shipment',s.id,'status_change',auth.uid(),jsonb_build_object('from',s.status,'to',p_new_status));
end $$;

create or replace function public.assign_driver(p_shipment_id uuid,p_driver_id uuid)
returns void language plpgsql security definer set search_path=public as $$
declare s public.shipments%rowtype;
begin
  if public.app_role() not in ('super_admin','admin','manager','dispatcher') then raise exception 'Not authorized'; end if;
  select * into s from public.shipments where id=p_shipment_id for update;
  if not found or s.organization_id is distinct from public.app_org_id() then raise exception 'Shipment not found'; end if;
  if s.status in ('delivered','refused','returned','cancelled') then raise exception 'Shipment closed'; end if;
  if not exists(select 1 from public.drivers where id=p_driver_id and organization_id=s.organization_id and active) then raise exception 'Invalid driver'; end if;
  update public.shipments set driver_id=p_driver_id,updated_at=now() where id=s.id;
  insert into public.audit_logs(organization_id,entity_type,entity_id,action,actor_id,details)
    values(s.organization_id,'shipment',s.id,'driver_assigned',auth.uid(),jsonb_build_object('driver_id',p_driver_id));
end $$;

create or replace function public.receive_cod(p_shipment_id uuid)
returns void language plpgsql security definer set search_path=public as $$
declare s public.shipments%rowtype;
begin
  if public.app_role() not in ('super_admin','admin','manager','accountant') then raise exception 'Not authorized'; end if;
  select * into s from public.shipments where id=p_shipment_id for update;
  if not found or s.organization_id is distinct from public.app_org_id() or s.status<>'delivered' then raise exception 'Only delivered shipments can be reconciled'; end if;
  if s.cash_received_at is not null then return; end if;
  update public.shipments set cash_received_at=now() where id=s.id;
  insert into public.audit_logs(organization_id,entity_type,entity_id,action,actor_id)
    values(s.organization_id,'shipment',s.id,'cash_received',auth.uid());
end $$;

create or replace function public.add_stock(p_product_id uuid,p_change integer,p_reason text)
returns integer language plpgsql security definer set search_path=public as $$
declare p public.products%rowtype; n integer;
begin
  if public.app_role() not in ('super_admin','admin','manager','warehouse') then raise exception 'Not authorized'; end if;
  if p_change=0 or abs(p_change)>1000000 or length(trim(coalesce(p_reason,'')))<3 then raise exception 'Invalid stock movement'; end if;
  select * into p from public.products where id=p_product_id for update;
  if not found or p.organization_id is distinct from public.app_org_id() then raise exception 'Product not found'; end if;
  n:=p.quantity+p_change;
  if n<0 then raise exception 'Insufficient stock'; end if;
  update public.products set quantity=n where id=p.id;
  insert into public.stock_movements(organization_id,product_id,quantity_change,reason,actor_id)
    values(p.organization_id,p.id,p_change,left(p_reason,300),auth.uid());
  return n;
end $$;

create or replace function public.create_settlement(p_merchant_id uuid,p_shipment_ids uuid[])
returns uuid language plpgsql security definer set search_path=public as $$
declare v_id uuid; v_count integer; v_cod numeric(12,2); v_fees numeric(12,2);
begin
  if public.app_role() not in ('super_admin','admin','manager','accountant') then raise exception 'Not authorized'; end if;
  if array_length(p_shipment_ids,1) is null or array_length(p_shipment_ids,1)>1000
    or array_length(p_shipment_ids,1) <> (select count(distinct x) from unnest(p_shipment_ids) as x) then raise exception 'Invalid shipment list'; end if;
  if not exists(select 1 from public.merchants where id=p_merchant_id and organization_id=public.app_org_id()) then raise exception 'Merchant not found'; end if;
  perform 1 from public.shipments where id=any(p_shipment_ids) order by id for update;
  select count(*) into v_count from public.shipments s where s.id=any(p_shipment_ids)
    and s.organization_id=public.app_org_id() and s.merchant_id=p_merchant_id and s.status='delivered'
    and s.cash_received_at is not null and not exists(select 1 from public.settlement_items i where i.shipment_id=s.id);
  if v_count<>array_length(p_shipment_ids,1) then raise exception 'Some shipments are invalid or already settled'; end if;
  insert into public.settlements(organization_id,merchant_id,created_by)
    values(public.app_org_id(),p_merchant_id,auth.uid()) returning id into v_id;
  insert into public.settlement_items(organization_id,settlement_id,shipment_id,cod_mad,fee_mad)
    select s.organization_id,v_id,s.id,s.cod_amount_mad,s.delivery_fee_mad
    from public.shipments s where s.id=any(p_shipment_ids);
  select coalesce(sum(cod_mad),0),coalesce(sum(fee_mad),0) into v_cod,v_fees
    from public.settlement_items where settlement_id=v_id;
  update public.settlements set total_cod_mad=v_cod,total_fees_mad=v_fees,net_mad=v_cod-v_fees where id=v_id;
  insert into public.audit_logs(organization_id,entity_type,entity_id,action,actor_id)
    values(public.app_org_id(),'settlement',v_id,'created',auth.uid());
  return v_id;
end $$;

create or replace function public.mark_settlement_paid(p_settlement_id uuid,p_reference text)
returns void language plpgsql security definer set search_path=public as $$
declare v public.settlements%rowtype;
begin
  if public.app_role() not in ('super_admin','admin','manager','accountant') then raise exception 'Not authorized'; end if;
  select * into v from public.settlements where id=p_settlement_id for update;
  if not found or v.organization_id is distinct from public.app_org_id() or v.status<>'pending' then raise exception 'Settlement not pending'; end if;
  if length(trim(coalesce(p_reference,'')))<3 then raise exception 'Payment reference required'; end if;
  update public.settlements set status='paid',paid_at=now(),payment_reference=left(p_reference,120) where id=v.id;
  insert into public.audit_logs(organization_id,entity_type,entity_id,action,actor_id)
    values(v.organization_id,'settlement',v.id,'paid',auth.uid());
end $$;
-- Remove public RPC access and grant explicitly to logged in users.
revoke all on function public.change_shipment_status(uuid,public.shipment_status,text) from public;
revoke all on function public.assign_driver(uuid,uuid) from public;
revoke all on function public.receive_cod(uuid) from public;
revoke all on function public.add_stock(uuid,integer,text) from public;
revoke all on function public.create_settlement(uuid,uuid[]) from public;
revoke all on function public.mark_settlement_paid(uuid,text) from public;
grant execute on function public.change_shipment_status(uuid,public.shipment_status,text) to authenticated;
grant execute on function public.assign_driver(uuid,uuid) to authenticated;
grant execute on function public.receive_cod(uuid) to authenticated;
grant execute on function public.add_stock(uuid,integer,text) to authenticated;
grant execute on function public.create_settlement(uuid,uuid[]) to authenticated;
grant execute on function public.mark_settlement_paid(uuid,text) to authenticated;
-- Initial setup: create an Auth user via Supabase dashboard, then run
-- INSERT INTO public.organizations(name) VALUES ('Your Company') RETURNING id;
-- INSERT INTO public.profiles(id,organization_id,full_name,role)
-- VALUES ('AUTH_USER_UUID','ORGANIZATION_UUID','Administrator','super_admin');
