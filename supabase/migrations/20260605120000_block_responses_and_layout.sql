-- Add layout column to custom_steps
alter table public.custom_steps
  add column if not exists layout text not null default 'instruction-full';

-- Create block_responses table
create table if not exists public.block_responses (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null,
  module_id      text not null,
  lesson_id      text not null,
  step_id        text not null,
  block_id       text not null,
  block_type     text not null,
  correct        boolean not null,
  answer         jsonb,
  attempt_number integer not null default 1,
  created_at     timestamptz not null default now()
);

-- RLS
alter table public.block_responses enable row level security;

create policy "Students insert own block responses"
  on public.block_responses for insert
  with check (auth.uid() = user_id);

create policy "Teachers read their students block responses"
  on public.block_responses for select
  using (
    exists (
      select 1
      from public.class_students cs
      join public.classes c on c.id = cs.class_id
      where cs.student_user_id = block_responses.user_id
        and c.teacher_id = auth.uid()
    )
  );
