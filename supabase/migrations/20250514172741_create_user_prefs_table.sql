-- Create user_preferences table
create table user_preferences (
  id uuid default gen_random_uuid () primary key,
  user_id uuid references auth.users on delete cascade not null,
  preference_type text not null,
  value jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add indexes for faster queries
create index idx_user_preferences_user_id on user_preferences (user_id);

create index idx_user_preferences_type on user_preferences (preference_type);

-- Add row level security to restrict access
alter table user_preferences enable row level security;

-- Create policy for users to access only their own preferences
create policy "Users can view their own preferences" on user_preferences for
select
  using (auth.uid ()=user_id);

create policy "Users can insert their own preferences" on user_preferences for insert
with
  check (auth.uid ()=user_id);

create policy "Users can update their own preferences" on user_preferences
for update
  using (auth.uid ()=user_id);

-- This will set the `created_at` column on create and `updated_at` column on every update
create or replace function handle_times () returns trigger as $$
    BEGIN
    IF (TG_OP = 'INSERT') THEN
        NEW.created_at := now();
        NEW.updated_at := now();
    ELSEIF (TG_OP = 'UPDATE') THEN
        NEW.created_at = OLD.created_at;
        NEW.updated_at = now();
    END IF;
    RETURN NEW;
    END;
    $$ language plpgsql;

create trigger handle_user_preferences_times before insert
or
update on user_preferences for each row
execute procedure handle_times ();

-- Enable realtime for the profiles table
alter publication supabase_realtime
add table user_preferences;