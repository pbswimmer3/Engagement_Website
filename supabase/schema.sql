-- ─────────────────────────────────────────────────────────────────────────────
-- Engagement Website — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ── Guests table ──────────────────────────────────────────────────────────────
create table guests (
  id          uuid        primary key default uuid_generate_v4(),
  first_name  text        not null,
  last_name   text        not null,
  email       text        not null unique,
  rsvp_status text        not null default 'pending'
                          check (rsvp_status in ('pending', 'attending', 'not_attending')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Row Level Security — deny all public access
-- (API routes use the service role key which bypasses RLS)
alter table guests enable row level security;

-- Indexes for faster name search
create index guests_first_name_idx on guests (lower(first_name));
create index guests_last_name_idx  on guests (lower(last_name));

-- ── Add your guest list here ───────────────────────────────────────────────
-- Replace these examples with your actual guests.
-- You can also use the Supabase Table Editor (GUI) to add rows manually.

insert into guests (first_name, last_name, email) values
  ('Jane',   'Smith',  'jane.smith@example.com'),
  ('Raj',    'Patel',  'raj.patel@example.com'),
  ('Priya',  'Kumar',  'priya.kumar@example.com');

-- ─────────────────────────────────────────────────────────────────────────────
-- After running this, go to the Table Editor in Supabase to add all your guests.
-- The rsvp_status column defaults to 'pending' for every new guest.
-- ─────────────────────────────────────────────────────────────────────────────
