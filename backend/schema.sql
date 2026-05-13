-- Sharp Filter V2 — Database Schema
-- Compatible with Supabase (Postgres).
-- Run in Supabase SQL editor or via psql.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── users ───────────────────────────────────────────────────────────────────
create table if not exists users (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- ─── settings ────────────────────────────────────────────────────────────────
create table if not exists settings (
  id                        uuid primary key default uuid_generate_v4(),
  user_id                   uuid references users(id) on delete cascade,
  bankroll                  numeric(12,2) not null default 5000,
  unit_percentage           numeric(5,2) not null default 1.0,
  max_daily_units           numeric(5,2) not null default 3.0,
  max_weekly_units          numeric(5,2) not null default 10.0,
  daily_stop_loss_units     numeric(5,2) not null default -3.0,
  minimum_score             numeric(4,2) not null default 8.0,
  minimum_probability_edge  numeric(5,2) not null default 3.0,
  max_juice_warning         integer not null default -120,
  max_juice_hard_stop       integer not null default -130,
  parlays_enabled           boolean not null default false,
  allowed_markets           text[] default '{}',
  banned_markets            text[] default '{}',
  alert_phone               text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- ─── bet_candidates ──────────────────────────────────────────────────────────
create table if not exists bet_candidates (
  id                    text primary key,
  sport                 text not null,
  league                text not null,
  game                  text not null,
  game_start_time       timestamptz not null,
  market                text not null,
  player_or_team        text not null,
  bet_type              text not null check (bet_type in ('Over','Under','Spread','Moneyline','Total')),
  line                  numeric(8,2) not null,
  odds                  integer not null,
  sportsbook            text not null,
  projection            numeric(8,2),
  projection_edge       numeric(6,2),
  implied_probability   numeric(6,4),
  projected_probability numeric(6,4),
  estimated_ev          numeric(8,5),
  system_score          numeric(4,2) check (system_score >= 0 and system_score <= 10),
  confidence_tier       text check (confidence_tier in ('High','Medium','Low')),
  recommended_action    text,
  max_units             numeric(4,2) default 1,
  context_notes         text[] default '{}',
  risk_flags            text[] default '{}',
  market_comparison     jsonb default '[]',
  rule_checklist        jsonb default '{}',
  status                text not null default 'candidate'
                          check (status in ('candidate','approved','rejected','watchlist','expired')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists idx_bet_candidates_status on bet_candidates(status);
create index if not exists idx_bet_candidates_score on bet_candidates(system_score desc);
create index if not exists idx_bet_candidates_game_start on bet_candidates(game_start_time);

-- ─── bet_decisions ────────────────────────────────────────────────────────────
create table if not exists bet_decisions (
  id                  uuid primary key default uuid_generate_v4(),
  candidate_id        text references bet_candidates(id) on delete set null,
  user_id             uuid references users(id) on delete set null,
  decision            text not null check (decision in ('approve','reject','watch')),
  decision_reason     text,
  approved_units      numeric(4,2) default 1.0,
  timestamp           timestamptz not null default now(),
  original_line       numeric(8,2),
  original_odds       integer,
  closing_line        numeric(8,2),
  closing_odds        integer,
  result              text default 'pending'
                        check (result in ('win','loss','push','pending')),
  profit_loss_units   numeric(8,4),
  notes               text
);

create index if not exists idx_bet_decisions_user on bet_decisions(user_id);
create index if not exists idx_bet_decisions_result on bet_decisions(result);
create index if not exists idx_bet_decisions_timestamp on bet_decisions(timestamp desc);

-- ─── line_movements ───────────────────────────────────────────────────────────
create table if not exists line_movements (
  id            uuid primary key default uuid_generate_v4(),
  candidate_id  text references bet_candidates(id) on delete cascade,
  sportsbook    text not null,
  line          numeric(8,2) not null,
  odds          integer not null,
  timestamp     timestamptz not null default now()
);

create index if not exists idx_line_movements_candidate on line_movements(candidate_id, timestamp desc);

-- ─── alerts ──────────────────────────────────────────────────────────────────
create table if not exists alerts (
  id            uuid primary key default uuid_generate_v4(),
  candidate_id  text references bet_candidates(id) on delete set null,
  alert_type    text not null
                  check (alert_type in ('new_candidate','line_movement','injury_update','score_change')),
  message       text not null,
  sent_to       text,
  status        text not null default 'pending'
                  check (status in ('pending','sent','failed','disabled')),
  created_at    timestamptz not null default now()
);

-- ─── audit_logs ───────────────────────────────────────────────────────────────
create table if not exists audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references users(id) on delete set null,
  action      text not null,
  entity_type text,
  entity_id   text,
  details     jsonb default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists idx_audit_logs_user on audit_logs(user_id, created_at desc);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Enable RLS for multi-tenant security (single-user mode: policies allow all for now)
alter table users           enable row level security;
alter table settings        enable row level security;
alter table bet_decisions   enable row level security;
alter table audit_logs      enable row level security;

-- Single-user dev policies (replace with proper auth policies for multi-user)
create policy "allow_all_settings"    on settings      for all using (true);
create policy "allow_all_decisions"   on bet_decisions for all using (true);
create policy "allow_all_audit"       on audit_logs    for all using (true);
create policy "allow_all_candidates"  on bet_candidates for all using (true);
create policy "allow_all_movements"   on line_movements for all using (true);
create policy "allow_all_alerts"      on alerts        for all using (true);

-- ─── Updated_at trigger ───────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_settings_updated_at
  before update on settings
  for each row execute function update_updated_at();

create trigger trg_candidates_updated_at
  before update on bet_candidates
  for each row execute function update_updated_at();
