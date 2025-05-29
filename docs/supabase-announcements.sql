-- Announcements table
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  tags text[],
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS policies
alter table public.announcements enable row level security;

create policy "Admins/Owners can manage announcements" on public.announcements
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'owner'))
  );
create policy "All users can view announcements" on public.announcements
  for select using (true);
