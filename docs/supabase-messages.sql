-- Messages table (for direct and group chat)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id), -- null for direct admin-student chat, set for group chat
  sender_id uuid references profiles(id),
  recipient_id uuid references profiles(id), -- only for admin-student direct chat
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS policies
alter table public.messages enable row level security;

-- Only allow direct messages if one user is admin/owner and the other is student
create policy "Admin/Owner <-> Student direct messages only" on public.messages
  for all using (
    (
      (select role from public.profiles where id = sender_id) in ('admin', 'owner') and (select role from public.profiles where id = recipient_id) = 'student'
    )
    or
    (
      (select role from public.profiles where id = sender_id) = 'student' and (select role from public.profiles where id = recipient_id) in ('admin', 'owner')
    )
    or
    (course_id is not null) -- group chat
  );

-- Only allow group chat if course_id is set and user is enrolled in the course
create policy "Course group chat: only enrolled users can send/read" on public.messages
  for all using (
    (
      course_id is not null and
      (
        exists (select 1 from public.enrollments e where e.course_id = course_id and e.student_id = auth.uid())
        or exists (select 1 from public.courses c join public.profiles p on c.created_by = p.id where c.id = course_id and p.id = auth.uid() and p.role in ('admin', 'owner'))
      )
    )
    or
    (
      recipient_id = auth.uid() or sender_id = auth.uid()
    )
  );
