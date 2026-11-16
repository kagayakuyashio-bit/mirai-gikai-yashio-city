-- 市議会議員名簿（八潮市議会 公式サイトの議員名簿を出典とする）
-- 氏名・議席番号・当選回数・会派・任期のみ。住所・電話・メールは保存しない。
create table public.council_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  seat_number integer not null unique,
  terms_count integer,
  faction_id uuid references public.factions(id) on delete set null,
  term_start date,
  term_end date,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.council_members enable row level security;

create trigger update_council_members_updated_at
  before update on public.council_members
  for each row execute function update_updated_at_column();
