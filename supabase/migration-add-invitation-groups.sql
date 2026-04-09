-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION: Add invitation groups to existing guests table
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- Step 1: Add the invitation_group column
alter table guests add column if not exists invitation_group text;

-- Step 2: Make email nullable (some group members may not have an email)
alter table guests alter column email drop not null;

-- Step 3: Drop the unique constraint on email (multiple group members can share or lack emails)
alter table guests drop constraint if exists guests_email_key;

-- Step 4: Add an index for faster group lookups
create index if not exists guests_invitation_group_idx on guests (invitation_group);

-- ─────────────────────────────────────────────────────────────────────────────
-- Step 5: Assign invitation groups to your existing guests.
--
-- HOW IT WORKS:
--   Guests with the SAME invitation_group value are linked together.
--   Any member of a group can RSVP for every member of that group.
--   The value can be any string — pick something descriptive like 'biswas-jain'.
--   Guests with NULL invitation_group are treated as solo invitations.
--
-- OPTION A: Update via SQL (examples below — replace with your actual guests)
--
--   update guests set invitation_group = 'biswas-jain'
--   where id in ('uuid-of-prad', 'uuid-of-aanya');
--
--   update guests set invitation_group = 'patel-family'
--   where id in ('uuid-of-raj', 'uuid-of-priya');
--
-- OPTION B: Update via Supabase Table Editor (easiest)
--   1. Go to Table Editor → guests
--   2. You'll see a new "invitation_group" column
--   3. For each group of guests who share an invitation, type the same
--      group name (e.g. "smith-family") into their invitation_group cell
--   4. Leave solo guests as NULL
--
-- OPTION C: Bulk update by last name (if families share a last name)
--   This sets everyone with the same last name to the same group:
--
--   update guests set invitation_group = lower(last_name) || '-family';
--
--   Then manually fix any groups that don't match (e.g. couples with
--   different last names).
-- ─────────────────────────────────────────────────────────────────────────────
