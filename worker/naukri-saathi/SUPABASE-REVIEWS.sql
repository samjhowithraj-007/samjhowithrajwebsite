-- Book reviews for techsamjhoraj.com (26 Nov 2026). Run once in Supabase: SQL Editor > New query > paste > Run.
-- Visitors can only INSERT their own review, logged in, always unapproved. Only approved rows are readable by the site.
-- To approve a review: Table Editor > reviews > set approved = true (and verified = true if you checked the purchase).
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  book text not null,
  name text not null check (char_length(name) <= 60),
  city text check (char_length(city) <= 60),
  stars int not null check (stars between 1 and 5),
  title text check (char_length(title) <= 90),
  body text not null check (char_length(body) <= 600),
  user_email text,
  verified boolean not null default false,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
drop policy if exists "read approved reviews" on public.reviews;
create policy "read approved reviews" on public.reviews for select using (approved = true);
drop policy if exists "logged in users can submit" on public.reviews;
create policy "logged in users can submit" on public.reviews for insert to authenticated with check (approved = false and verified = false);
