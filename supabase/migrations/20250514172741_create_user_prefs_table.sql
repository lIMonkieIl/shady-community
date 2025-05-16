-- Create a table for user preferences
create table user_preferences (
  user_id uuid references profiles (id) on delete cascade primary key,
  theme jsonb not null default jsonb_build_object(
    'mode',
    'system',
    'name',
    'DDS',
    'decoration',
    'hemp'
  ),
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Enable row level security on user_preferences
alter table user_preferences enable row level security;

-- Allow users to view their own preferences
create policy "Users can view their preferences" on user_preferences for
select
  using (auth.uid ()=user_id);

-- Allow users to update their own preferences
create policy "Users can update their preferences" on user_preferences
for update
  using (auth.uid ()=user_id);

-- Reuse the handle_times function to manage created_at and updated_at
create trigger handle_user_preferences_times before insert
or
update on user_preferences for each row
execute procedure handle_times ();

-- Enable realtime for the user_preferences table
alter publication supabase_realtime
add table user_preferences;