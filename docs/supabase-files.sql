-- File uploads table (for resources, assignments, recordings)
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id),
  lesson_id uuid references lessons(id),
  uploader_id uuid references profiles(id),
  file_url text not null,
  file_name text not null,
  file_type text,
  uploaded_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS policies
alter table public.files enable row level security;

create policy "Admins/Owners can manage all files" on public.files
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'owner'))
  );
create policy "Students can upload to their courses/assignments" on public.files
  for insert with check (
    exists (select 1 from public.enrollments e where e.course_id = course_id and e.student_id = auth.uid())
  );
create policy "All users can view files for their courses" on public.files
  for select using (
    exists (select 1 from public.enrollments e where e.course_id = course_id and e.student_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'owner'))
  );
