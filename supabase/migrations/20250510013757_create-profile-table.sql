-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  created_at timestamptz default now(),
  username text unique,
  avatar_url text,
  constraint username_length check (char_length(username)>=3)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for
select
  using (true);

create or replace function public.handle_new_user () returns trigger
set
  search_path='' as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace function public.handle_user_update () returns trigger
set
  search_path='' as $$
begin
  update public.profiles
  set 
    username = coalesce(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name'),
    avatar_url = new.raw_user_meta_data->>'avatar_url'
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();

create trigger on_auth_user_updated
after
update on auth.users for each row when (
  old.raw_user_meta_data is distinct from new.raw_user_meta_data
)
execute procedure public.handle_user_update ();

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

create trigger handle_profile_times before insert
or
update on profiles for each row
execute procedure handle_times ();

-- Enable realtime for the profiles table
alter publication supabase_realtime
add table profiles;
