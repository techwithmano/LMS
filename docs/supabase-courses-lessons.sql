-- Courses table
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  instructor text,
  image_url text,
  image_hint text,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Lessons table
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  type text not null, -- 'video' or 'text'
  content text,
  video_url text,
  duration text,
  order_num int,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enrollment table (students assigned to courses)
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  enrolled_at timestamp with time zone default timezone('utc'::text, now())
);

-- Row Level Security
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;

-- Policies for courses
create policy "Admins/Owners can manage courses" on public.courses
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'owner'))
  );
create policy "Students can view assigned courses" on public.courses
  for select using (
    exists (select 1 from public.enrollments e where e.course_id = id and e.student_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'owner'))
  );

-- Policies for lessons
create policy "Admins/Owners can manage lessons" on public.lessons
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'owner'))
  );
create policy "Students can view lessons in assigned courses" on public.lessons
  for select using (
    exists (select 1 from public.enrollments e join public.courses c on c.id = e.course_id where e.student_id = auth.uid() and lessons.course_id = c.id)
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'owner'))
  );

-- Policies for enrollments
create policy "Admins/Owners can manage enrollments" on public.enrollments
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'owner'))
  );
create policy "Students can view their enrollments" on public.enrollments
  for select using (student_id = auth.uid());
