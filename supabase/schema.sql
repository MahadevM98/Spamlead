create table if not exists public.ai_interactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  prompt_text text not null,
  gemini_response text not null,
  created_at timestamptz not null default now()
);

alter table public.ai_interactions enable row level security;

create policy "Users can view their own AI interactions"
on public.ai_interactions
for select
to authenticated
using ( (select auth.uid()) = user_id );

create policy "Users can insert their own AI interactions"
on public.ai_interactions
for insert
to authenticated
with check ( (select auth.uid()) = user_id );

create index if not exists ai_interactions_user_id_idx on public.ai_interactions(user_id);
