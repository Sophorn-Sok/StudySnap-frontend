create extension if not exists "pgcrypto";

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  username text not null unique,
  password_hash text not null,
  first_name text,
  last_name text,
  avatar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists auth_sessions (
  token text primary key,
  user_id uuid not null references app_users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create table if not exists email_otps (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  purpose text not null check (purpose in ('register', 'login')),
  otp_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_otps_lookup on email_otps(email, purpose, consumed_at, created_at desc);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  title text not null,
  content text not null,
  tags text[] not null default '{}',
  is_shared boolean not null default false,
  shared_with uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists note_versions (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references notes(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  created_by uuid not null references app_users(id)
);

create table if not exists flashcard_decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists flashcards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references flashcard_decks(id) on delete cascade,
  front text not null,
  back text not null,
  difficulty text not null default 'easy' check (difficulty in ('easy', 'medium', 'hard')),
  last_reviewed_at timestamptz,
  review_count integer not null default 0
);

create table if not exists study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  deck_id uuid not null references flashcard_decks(id) on delete cascade,
  cards_studied integer not null default 0,
  correct_answers integer not null default 0,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  title text not null,
  transcript text not null default '',
  ai_notes text not null default '',
  recording_url text,
  duration integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- This backend currently uses a custom token/session system with Supabase anon key.
-- Disable RLS on app tables so server-side API routes can read/write rows.
alter table app_users disable row level security;
alter table auth_sessions disable row level security;
alter table email_otps disable row level security;
alter table notes disable row level security;
alter table note_versions disable row level security;
alter table flashcard_decks disable row level security;
alter table flashcards disable row level security;
alter table study_sessions disable row level security;
alter table meetings disable row level security;

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on table app_users to anon, authenticated;
grant select, insert, update, delete on table auth_sessions to anon, authenticated;
grant select, insert, update, delete on table email_otps to anon, authenticated;
grant select, insert, update, delete on table notes to anon, authenticated;
grant select, insert, update, delete on table note_versions to anon, authenticated;
grant select, insert, update, delete on table flashcard_decks to anon, authenticated;
grant select, insert, update, delete on table flashcards to anon, authenticated;
grant select, insert, update, delete on table study_sessions to anon, authenticated;
grant select, insert, update, delete on table meetings to anon, authenticated;
