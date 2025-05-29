-- Quizzes and Assignments table
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  description text,
  type text not null, -- 'Quiz' or 'Assignment'
  due_date date,
  total_points int,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Questions table (for quizzes)
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references quizzes(id) on delete cascade,
  question_text text not null,
  question_type text not null, -- 'multiple_choice', 'short_answer', etc.
  options jsonb, -- for multiple choice
  correct_answer text, -- for auto-grading
  points int,
  order_num int,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Submissions table
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references quizzes(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  answers jsonb,
  score int,
  feedback text,
  graded_by uuid references profiles(id),
  submitted_at timestamp with time zone default timezone('utc'::text, now()),
  graded_at timestamp with time zone
);

-- RLS policies
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.submissions enable row level security;

create policy "Admins/Owners can manage quizzes" on public.quizzes
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'owner'))
  );
create policy "Students can view quizzes in enrolled courses" on public.quizzes
  for select using (
    exists (select 1 from public.enrollments e where e.course_id = quizzes.course_id and e.student_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'owner'))
  );

create policy "Admins/Owners can manage questions" on public.questions
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'owner'))
  );
create policy "Students can view questions for quizzes in enrolled courses" on public.questions
  for select using (
    exists (select 1 from public.quizzes q join public.enrollments e on q.course_id = e.course_id where q.id = questions.quiz_id and e.student_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'owner'))
  );

create policy "Admins/Owners can manage submissions" on public.submissions
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'owner'))
  );
create policy "Students can view and insert their own submissions" on public.submissions
  for select using (student_id = auth.uid());
create policy "Students can insert their own submissions" on public.submissions
  for insert with check (student_id = auth.uid());
