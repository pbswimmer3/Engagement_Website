-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: Add `invite_group` column to `guests`
--
-- Purpose
--   Track WHO invited each guest — one of: 'praanya', 'jain', 'biswas'.
--   This is distinct from `invitation_group`, which groups guests that RSVP
--   together (e.g. a family). `invite_group` gates which side of the party
--   can see a guest on the RSVP lookup, and each side has its own site
--   password.
--
-- Behavior
--   * Existing rows default to 'praanya' (the current database is entirely
--     Praanya invitees). Jain / Biswas rows will be inserted later.
--   * NOT NULL + CHECK constraint enforces the three allowed values.
--   * Index added for fast filtering on the RSVP search endpoint.
--
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

alter table guests
  add column invite_group text not null default 'praanya'
    check (invite_group in ('praanya', 'jain', 'biswas'));

create index guests_invite_group_idx on guests (invite_group);

-- ── Later, when Jain / Biswas guests are added ────────────────────────────────
-- Either insert them with the correct invite_group, e.g.
--
--   insert into guests (first_name, last_name, email, invitation_group, invite_group)
--   values ('Some',  'Person',  'a@b.com',  'some-family',  'jain');
--
-- Or reassign an existing row:
--
--   update guests set invite_group = 'biswas' where id = '...';
-- ─────────────────────────────────────────────────────────────────────────────
