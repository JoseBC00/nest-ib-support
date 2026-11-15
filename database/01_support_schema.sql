-- NEST IB SUPPORT v2.0 | Migracion ADITIVA, no elimina tablas anteriores.
-- Ejecutar en el MISMO proyecto Supabase de tu login existente, UNA VEZ.
-- Haz un respaldo antes. Las tablas nuevas comienzan con support_.
begin;

create table if not exists public.support_staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','moderator')),
  created_at timestamptz not null default now()
);
alter table public.support_staff enable row level security;
revoke all on public.support_staff from anon,authenticated;
grant select on public.support_staff to authenticated;
drop policy if exists support_staff_self on public.support_staff;
create policy support_staff_self on public.support_staff for select to authenticated
using (user_id=(select auth.uid()));

create or replace function public.support_is_staff(p_admin_only boolean default false)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.support_staff s
    where s.user_id = auth.uid() and (not p_admin_only or s.role='admin'));
$$;
revoke all on function public.support_is_staff(boolean) from public;
grant execute on function public.support_is_staff(boolean) to anon,authenticated;

create table if not exists public.support_categories (
 id bigint generated always as identity primary key,
 name text not null check (char_length(trim(name)) between 2 and 70),
 active boolean not null default true,
 position integer not null default 0,
 created_at timestamptz not null default now()
);
create unique index if not exists support_categories_norm_idx on public.support_categories
 ((lower(regexp_replace(btrim(name),'[[:space:]]+',' ','g'))));
alter table public.support_categories enable row level security;
revoke all on public.support_categories from anon,authenticated;
grant select on public.support_categories to anon,authenticated;
grant insert,update,delete on public.support_categories to authenticated;
drop policy if exists support_categories_read on public.support_categories;
create policy support_categories_read on public.support_categories for select to anon,authenticated using (true);
drop policy if exists support_categories_insert on public.support_categories;
create policy support_categories_insert on public.support_categories for insert to authenticated with check ((select public.support_is_staff(true)));
drop policy if exists support_categories_update on public.support_categories;
create policy support_categories_update on public.support_categories for update to authenticated using ((select public.support_is_staff(true))) with check ((select public.support_is_staff(true)));
drop policy if exists support_categories_delete on public.support_categories;
create policy support_categories_delete on public.support_categories for delete to authenticated using ((select public.support_is_staff(true)));

create table if not exists public.support_decks (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(trim(title)) between 2 and 120),
 description text not null default '',
 category_id bigint references public.support_categories(id) on delete restrict,
 level text not null default 'NM' check (level in ('NM','NS','CORE')),
 status text not null default 'draft' check (status in ('draft','pending','published','rejected')),
 review_note text not null default '',
 provenance jsonb not null default '[]'::jsonb,
 revision integer not null default 1,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists support_decks_feed_idx on public.support_decks(status,category_id,created_at desc);
create index if not exists support_decks_owner_idx on public.support_decks(owner_id);
alter table public.support_decks enable row level security;
revoke all on public.support_decks from anon,authenticated;
grant select on public.support_decks to anon,authenticated;
drop policy if exists support_decks_read on public.support_decks;
create policy support_decks_read on public.support_decks for select to anon,authenticated
using (status='published' or owner_id=(select auth.uid()) or (select public.support_is_staff()));

create table if not exists public.support_cards (
 id uuid primary key default gen_random_uuid(),
 deck_id uuid not null references public.support_decks(id) on delete cascade,
 position integer not null,
 front text not null,
 back text not null,
 extra jsonb not null default '{}'::jsonb
);
create index if not exists support_cards_deck_idx on public.support_cards(deck_id,position);
alter table public.support_cards enable row level security;
revoke all on public.support_cards from anon,authenticated;
grant select on public.support_cards to anon,authenticated;
drop policy if exists support_cards_read on public.support_cards;
create policy support_cards_read on public.support_cards for select to anon,authenticated
using (exists(select 1 from public.support_decks d where d.id=deck_id));

create table if not exists public.support_packages (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(trim(title)) between 2 and 120),
 description text not null default '',
 category_id bigint references public.support_categories(id) on delete restrict,
 level text not null default 'NM' check (level in ('NM','NS','CORE')),
 status text not null default 'draft' check (status in ('draft','pending','published','rejected')),
 review_note text not null default '',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists support_packages_feed_idx on public.support_packages(status,category_id,created_at desc);
alter table public.support_packages enable row level security;
revoke all on public.support_packages from anon,authenticated;
grant select,insert,delete on public.support_packages to authenticated;
grant select on public.support_packages to anon;
grant update(title,description,category_id,level,updated_at) on public.support_packages to authenticated;
drop policy if exists support_packages_read on public.support_packages;
create policy support_packages_read on public.support_packages for select to anon,authenticated
using (status='published' or owner_id=(select auth.uid()) or (select public.support_is_staff()));
drop policy if exists support_packages_insert on public.support_packages;
create policy support_packages_insert on public.support_packages for insert to authenticated
with check (owner_id=(select auth.uid()) and status='draft');
drop policy if exists support_packages_update on public.support_packages;
create policy support_packages_update on public.support_packages for update to authenticated
using (owner_id=(select auth.uid()) and status in ('draft','rejected'))
with check (owner_id=(select auth.uid()) and status in ('draft','rejected'));
drop policy if exists support_packages_delete on public.support_packages;
create policy support_packages_delete on public.support_packages for delete to authenticated
using (owner_id=(select auth.uid()) and status in ('draft','rejected'));

create table if not exists public.support_package_items (
 package_id uuid not null references public.support_packages(id) on delete cascade,
 deck_id uuid not null references public.support_decks(id) on delete restrict,
 position integer not null default 0,
 primary key(package_id,deck_id)
);
alter table public.support_package_items enable row level security;
revoke all on public.support_package_items from anon,authenticated;
grant select on public.support_package_items to anon,authenticated;
grant insert,update,delete on public.support_package_items to authenticated;
drop policy if exists support_package_items_read on public.support_package_items;
create policy support_package_items_read on public.support_package_items for select to anon,authenticated
using (exists (select 1 from public.support_packages p where p.id=package_id));
drop policy if exists support_package_items_insert on public.support_package_items;
create policy support_package_items_insert on public.support_package_items for insert to authenticated
with check (exists (select 1 from public.support_packages p where p.id=package_id and p.owner_id=(select auth.uid()) and p.status in ('draft','rejected'))
 and exists (select 1 from public.support_decks d where d.id=deck_id and (d.owner_id=(select auth.uid()) or d.status='published')));
drop policy if exists support_package_items_delete on public.support_package_items;
create policy support_package_items_delete on public.support_package_items for delete to authenticated
using (exists (select 1 from public.support_packages p where p.id=package_id and p.owner_id=(select auth.uid()) and p.status in ('draft','rejected')));
drop policy if exists support_package_items_update on public.support_package_items;
create policy support_package_items_update on public.support_package_items for update to authenticated
using (exists (select 1 from public.support_packages p where p.id=package_id and p.owner_id=(select auth.uid()) and p.status in ('draft','rejected')))
with check (exists (select 1 from public.support_packages p where p.id=package_id and p.owner_id=(select auth.uid()) and p.status in ('draft','rejected')));

create table if not exists public.support_exams (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(trim(title)) between 2 and 120),
 description text not null default '' check (length(description)<=1500),
 category_id bigint references public.support_categories(id) on delete restrict,
 level text not null default 'NM' check(level in ('NM','NS','CORE')),
 paper text not null default 'Paper 1',
 duration_minutes integer not null default 60 check(duration_minutes between 1 and 600),
 reading_minutes integer not null default 0 check(reading_minutes between 0 and 15),
 questions jsonb not null default '[]'::jsonb,
 status text not null default 'draft' check (status in ('draft','pending','published','rejected')),
 review_note text not null default '',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint exam_questions_array check(jsonb_typeof(questions)='array' and jsonb_array_length(questions)<=80 and pg_column_size(questions)<=200000)
);
create index if not exists support_exams_feed_idx on public.support_exams(status,category_id,created_at desc);
alter table public.support_exams enable row level security;
revoke all on public.support_exams from anon,authenticated;
grant select on public.support_exams to anon,authenticated;
grant insert,delete on public.support_exams to authenticated;
grant update(title,description,category_id,level,paper,duration_minutes,reading_minutes,questions,updated_at) on public.support_exams to authenticated;
drop policy if exists support_exams_read on public.support_exams;
create policy support_exams_read on public.support_exams for select to anon,authenticated
using (status='published' or owner_id=(select auth.uid()) or (select public.support_is_staff()));
drop policy if exists support_exams_insert on public.support_exams;
create policy support_exams_insert on public.support_exams for insert to authenticated
with check (owner_id=(select auth.uid()) and status='draft');
drop policy if exists support_exams_update on public.support_exams;
create policy support_exams_update on public.support_exams for update to authenticated
using (owner_id=(select auth.uid()) and status in ('draft','rejected'))
with check (owner_id=(select auth.uid()) and status in ('draft','rejected'));
drop policy if exists support_exams_delete on public.support_exams;
create policy support_exams_delete on public.support_exams for delete to authenticated
using (owner_id=(select auth.uid()) and status in ('draft','rejected'));

create table if not exists public.support_attempts (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 exam_id uuid not null references public.support_exams(id) on delete cascade,
 state text not null default 'reading' check (state in ('reading','running','paused','submitted','graded')),
 payload jsonb not null default '{}'::jsonb check (pg_column_size(payload)<=200000),
 remaining_seconds integer not null default 0 check (remaining_seconds between 0 and 100000),
 last_started_at timestamptz,
 score numeric(9,2),
 max_score numeric(9,2),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists support_attempts_owner_idx on public.support_attempts(owner_id,updated_at desc);
alter table public.support_attempts enable row level security;
revoke all on public.support_attempts from anon,authenticated;
grant select,insert,update,delete on public.support_attempts to authenticated;
drop policy if exists support_attempts_self on public.support_attempts;
create policy support_attempts_self on public.support_attempts for all to authenticated
using (owner_id=(select auth.uid())) with check (owner_id=(select auth.uid()));

create table if not exists public.support_prompts (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(trim(title)) between 2 and 120),
 description text not null default '',
 category_id bigint references public.support_categories(id) on delete restrict,
 level text not null default 'CORE' check(level in ('NM','NS','CORE')),
 intensity text not null default 'medio' check (intensity in ('minimo','medio','maximo')),
 content text not null check (char_length(content) between 1 and 20000),
 status text not null default 'draft' check(status in ('draft','pending','published','rejected')),
 review_note text not null default '',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists support_prompts_feed_idx on public.support_prompts(status,category_id,created_at desc);
alter table public.support_prompts enable row level security;
revoke all on public.support_prompts from anon,authenticated;
grant select on public.support_prompts to anon,authenticated;
grant insert,delete on public.support_prompts to authenticated;
grant update(title,description,category_id,level,intensity,content,updated_at) on public.support_prompts to authenticated;
drop policy if exists support_prompts_read on public.support_prompts;
create policy support_prompts_read on public.support_prompts for select to anon,authenticated
using (status='published' or owner_id=(select auth.uid()) or (select public.support_is_staff()));
drop policy if exists support_prompts_insert on public.support_prompts;
create policy support_prompts_insert on public.support_prompts for insert to authenticated
with check (owner_id=(select auth.uid()) and status='draft');
drop policy if exists support_prompts_update on public.support_prompts;
create policy support_prompts_update on public.support_prompts for update to authenticated
using (owner_id=(select auth.uid()) and status in ('draft','rejected'))
with check (owner_id=(select auth.uid()) and status in ('draft','rejected'));
drop policy if exists support_prompts_delete on public.support_prompts;
create policy support_prompts_delete on public.support_prompts for delete to authenticated
using (owner_id=(select auth.uid()) and status in ('draft','rejected'));

create table if not exists public.support_favorites (
 user_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check(kind in ('deck','package','exam','prompt')),
 item_id uuid not null,
 created_at timestamptz not null default now(),
 primary key(user_id,kind,item_id)
);
alter table public.support_favorites enable row level security;
revoke all on public.support_favorites from anon,authenticated;
grant select,insert,delete on public.support_favorites to authenticated;
drop policy if exists support_favorites_self on public.support_favorites;
create policy support_favorites_self on public.support_favorites for all to authenticated
using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));

create table if not exists public.support_links (
 id bigint generated always as identity primary key,
 name text not null,
 description text not null default '',
 url text not null,
 active boolean not null default true,
 position integer not null default 0
);
alter table public.support_links enable row level security;
revoke all on public.support_links from anon,authenticated;
grant select on public.support_links to anon,authenticated;
grant insert,update,delete on public.support_links to authenticated;
drop policy if exists support_links_read on public.support_links;
create policy support_links_read on public.support_links for select to anon,authenticated using (true);
drop policy if exists support_links_manage on public.support_links;
create policy support_links_manage on public.support_links for all to authenticated
using ((select public.support_is_staff(true))) with check ((select public.support_is_staff(true)));

create table if not exists public.support_media (
 id uuid primary key default gen_random_uuid(),
 exam_id uuid not null references public.support_exams(id) on delete cascade,
 owner_id uuid not null references auth.users(id) on delete cascade,
 drive_file_id text not null,
 mime_type text not null check(mime_type in ('image/png','image/jpeg','image/webp')),
 size_bytes integer not null check(size_bytes between 1 and 1500000),
 created_at timestamptz not null default now()
);
alter table public.support_media enable row level security;
revoke all on public.support_media from anon,authenticated;
grant select on public.support_media to anon,authenticated;
drop policy if exists support_media_read on public.support_media;
create policy support_media_read on public.support_media for select to anon,authenticated
using (owner_id=(select auth.uid()) or (select public.support_is_staff()) or
exists (select 1 from public.support_exams e where e.id=exam_id and e.status='published'));

create table if not exists public.support_drive_upload_log (
 user_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
create index if not exists support_drive_upload_log_idx on public.support_drive_upload_log(user_id,created_at desc);
alter table public.support_drive_upload_log enable row level security;
revoke all on public.support_drive_upload_log from anon,authenticated;

-- Seudonimos publicos SOLO para autores que ya tengan publicaciones aprobadas.
-- Mantiene las politicas existentes de profiles (su propio perfil).
do $$ begin
 if to_regclass('public.profiles') is not null then
  execute 'grant select (id,nickname) on public.profiles to anon';
  execute $p$create policy support_published_authors on public.profiles for select to anon,authenticated using (
    exists(select 1 from public.support_decks d where d.owner_id=profiles.id and d.status='published')
    or exists(select 1 from public.support_packages p where p.owner_id=profiles.id and p.status='published')
    or exists(select 1 from public.support_exams e where e.owner_id=profiles.id and e.status='published')
    or exists(select 1 from public.support_prompts pr where pr.owner_id=profiles.id and pr.status='published')
  )$p$;
 end if;
exception when duplicate_object then null;
end $$;

-- Guardar un deck y sus tarjetas en UNA operacion atomica con control de versiones.
create or replace function public.support_save_deck(
 p_id uuid,p_expected integer,p_title text,p_description text,p_category bigint,
 p_level text,p_cards jsonb,p_provenance jsonb default '[]'::jsonb
) returns table(deck_id uuid,new_revision integer)
language plpgsql security definer set search_path='' as $$
declare v_uid uuid:=auth.uid(); v_rev integer; v_status text; v_card jsonb; v_id uuid;
begin
 if v_uid is null then raise exception 'Inicia sesion para sincronizar'; end if;
 if length(trim(coalesce(p_title,''))) not between 2 and 120
  or length(coalesce(p_description,''))>1500
  or p_level not in ('NM','NS','CORE')
  or coalesce(jsonb_typeof(p_cards),'')<>'array'
  or jsonb_array_length(p_cards)>1000
  or coalesce(jsonb_typeof(p_provenance),'')<>'array'
  or p_expected is null or p_expected<0
 then raise exception 'Datos del deck invalidos'; end if;
 if p_category is not null and not exists(select 1 from public.support_categories where id=p_category and active) then
   raise exception 'Categoria no disponible'; end if;
 for v_card in select value from jsonb_array_elements(p_cards) loop
  if length(trim(coalesce(v_card->>'front',''))) not between 1 and 2000
   or length(trim(coalesce(v_card->>'back',''))) not between 1 and 6000
   or length(coalesce(v_card->'extra','{}'::jsonb)::text)>8000
  then raise exception 'Hay una tarjeta vacia o demasiado larga'; end if;
 end loop;
 v_id:=coalesce(p_id,gen_random_uuid());
 select d.revision,d.status into v_rev,v_status from public.support_decks d where d.id=v_id and d.owner_id=v_uid for update;
 if not found then
   if p_expected<>0 then raise exception 'Conflicto: no existe la version indicada'; end if;
   if exists(select 1 from public.support_decks where id=v_id) then raise exception 'Deck ajeno'; end if;
   insert into public.support_decks(id,owner_id,title,description,category_id,level,provenance,revision)
   values(v_id,v_uid,trim(p_title),coalesce(p_description,''),p_category,p_level,p_provenance,1);
   v_rev:=1;
 else
   if v_status not in ('draft','rejected') then raise exception 'No puedes editar un deck en revision o publicado; duplicalo'; end if;
   if v_rev<>p_expected then raise exception 'Conflicto: hay una version mas reciente. Recarga antes de guardar.'; end if;
   update public.support_decks set title=trim(p_title),description=coalesce(p_description,''),category_id=p_category,
      level=p_level,provenance=p_provenance,revision=revision+1,updated_at=now()
   where id=v_id;
   delete from public.support_cards where deck_id=v_id;
   v_rev:=v_rev+1;
 end if;
 insert into public.support_cards(deck_id,position,front,back,extra)
 select v_id,(ord-1)::integer,elem->>'front',elem->>'back',coalesce(elem->'extra','{}'::jsonb)
 from jsonb_array_elements(p_cards) with ordinality as items(elem,ord);
 return query select v_id,v_rev;
end;
$$;
revoke all on function public.support_save_deck(uuid,integer,text,text,bigint,text,jsonb,jsonb) from public;
grant execute on function public.support_save_deck(uuid,integer,text,text,bigint,text,jsonb,jsonb) to authenticated;

create or replace function public.support_submit(p_kind text,p_id uuid)
returns void language plpgsql security definer set search_path='' as $$
declare v_uid uuid:=auth.uid(); v_ok boolean:=false;
begin
 if v_uid is null then raise exception 'Inicia sesion'; end if;
 if p_kind='deck' then
   if not exists(select 1 from public.support_cards where deck_id=p_id) then raise exception 'El deck no tiene tarjetas'; end if;
   update public.support_decks set status='pending',review_note='' where id=p_id and owner_id=v_uid and status in ('draft','rejected');
 elsif p_kind='package' then
   if not exists(select 1 from public.support_package_items where package_id=p_id) then raise exception 'Paquete vacio'; end if;
   if exists(select 1 from public.support_package_items pi join public.support_decks d on d.id=pi.deck_id
     where pi.package_id=p_id and d.status<>'published') then raise exception 'Todos los decks de un paquete publico deben estar aprobados'; end if;
   update public.support_packages set status='pending',review_note='' where id=p_id and owner_id=v_uid and status in ('draft','rejected');
 elsif p_kind='exam' then
   if not exists(select 1 from public.support_exams where id=p_id and jsonb_array_length(questions)>0) then raise exception 'Examen sin preguntas'; end if;
   update public.support_exams set status='pending',review_note='' where id=p_id and owner_id=v_uid and status in ('draft','rejected');
 elsif p_kind='prompt' then
   update public.support_prompts set status='pending',review_note='' where id=p_id and owner_id=v_uid and status in ('draft','rejected');
 else raise exception 'Tipo de contenido invalido'; end if;
 if not found then raise exception 'Recurso no encontrado o bloqueado'; end if;
end;
$$;
revoke all on function public.support_submit(text,uuid) from public;
grant execute on function public.support_submit(text,uuid) to authenticated;

create or replace function public.support_review(p_kind text,p_id uuid,p_approve boolean,p_note text default '')
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.support_is_staff() then raise exception 'No autorizado'; end if;
 if not p_approve and length(trim(coalesce(p_note,'')))<5 then raise exception 'Explica el rechazo'; end if;
 if p_kind='deck' then
   update public.support_decks set status=(case when p_approve then 'published' else 'rejected' end),review_note=left(coalesce(p_note,''),1000) where id=p_id and status='pending';
 elsif p_kind='package' then
   update public.support_packages set status=(case when p_approve then 'published' else 'rejected' end),review_note=left(coalesce(p_note,''),1000) where id=p_id and status='pending';
 elsif p_kind='exam' then
   update public.support_exams set status=(case when p_approve then 'published' else 'rejected' end),review_note=left(coalesce(p_note,''),1000) where id=p_id and status='pending';
 elsif p_kind='prompt' then
   update public.support_prompts set status=(case when p_approve then 'published' else 'rejected' end),review_note=left(coalesce(p_note,''),1000) where id=p_id and status='pending';
 else raise exception 'Tipo invalido'; end if;
 if not found then raise exception 'Recurso no encontrado en pendientes'; end if;
end;
$$;
revoke all on function public.support_review(text,uuid,boolean,text) from public;
grant execute on function public.support_review(text,uuid,boolean,text) to authenticated;

create or replace function public.support_merge_category(p_from bigint,p_to bigint)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.support_is_staff(true) or p_from=p_to then raise exception 'Operacion no autorizada'; end if;
 update public.support_decks set category_id=p_to where category_id=p_from;
 update public.support_packages set category_id=p_to where category_id=p_from;
 update public.support_exams set category_id=p_to where category_id=p_from;
 update public.support_prompts set category_id=p_to where category_id=p_from;
 delete from public.support_categories where id=p_from;
end;
$$;
revoke all on function public.support_merge_category(bigint,bigint) from public;
grant execute on function public.support_merge_category(bigint,bigint) to authenticated;

insert into public.support_categories(name,position) values
 ('Matemáticas AA',1),('Matemáticas AI',2),('Biología',3),('Química',4),('Física',5),
 ('Historia',6),('Lengua y Literatura',7),('Literatura',8),('Economía',9),
 ('Psicología',10),('Filosofía',11),('Teoría del Conocimiento',12),('CAS',13),
 ('Inglés B',14),('Otra asignatura',99)
on conflict do nothing;
insert into public.support_links(name,description,url,position) values
 ('Calculadora IB','Calcula escenarios orientativos de notas del IB.','https://www.ibcalculator.com/',1),
 ('Dark IB','Recurso interactivo complementario para estudiantes.','https://view.genially.com/6621c6fa799e720014387577',2),
 ('Biblioteca general','Accede a una colección compartida de recursos.','https://drive.google.com/drive/folders/1mew7Kxg-FLXkVN__c0rGLTbKNK401Bxr?usp=drive_link',3);
commit;
