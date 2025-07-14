-- Create item enums
create type mix_category_enum as enum('Drug', 'Pre-Mix');

create type mix_type_enum as enum(
  'Liquid',
  'Powder',
  'Crystal',
  'Pills',
  'Granulate',
  'Dried Plant',
  'Mushrooms'
);

create type mix_visibility_enum as enum('Public', 'Private');

-- Create mixes table
create table mixes (
  id uuid default gen_random_uuid () primary key,
  parent_ingredient_id uuid,
  name text not null,
  category mix_category_enum not null,
  type mix_type_enum not null,
  image text not null,
  description text,
  information text,
  toxicity numeric not null,
  strength numeric not null,
  addictiveness numeric not null,
  mix_strengthening numeric not null,
  visibility mix_visibility_enum not null default 'Private',
  created_by uuid references auth.users (id) on delete cascade,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create mix_recipes table
create table mix_recipes (
  id uuid default gen_random_uuid () primary key,
  parent_ingredient_id uuid references public.mixes (id) on delete cascade,
  child_ingredient_id uuid not null,
  amount numeric not null,
  order_index integer not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create user_preferences table
create table user_preferences (
  id uuid default gen_random_uuid () primary key,
  user_id uuid references auth.users (id) on delete cascade,
  preference_type text not null,
  value jsonb not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create trigger function to manage created_at and updated_at
create or replace function update_timestamps () returns trigger as $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.created_at = NOW();
        NEW.updated_at = NOW();
    ELSIF TG_OP = 'UPDATE' THEN
        NEW.updated_at = NOW();
        -- Preserve created_at from the old row
        NEW.created_at = OLD.created_at;
    END IF;
    RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers for timestamp management
create trigger update_mixes_timestamps before insert
or
update on mixes for each row
execute function update_timestamps ();

create trigger update_mix_recipes_timestamps before insert
or
update on mix_recipes for each row
execute function update_timestamps ();

create trigger update_user_preferences_timestamps before insert
or
update on user_preferences for each row
execute function update_timestamps ();

-- Enable RLS on all tables
alter table mixes enable row level security;

alter table mix_recipes enable row level security;

alter table user_preferences enable row level security;

-- RLS policies for mixes table
-- Public can read public mixes
create policy "Public can read public mixes" on mixes for
select
  to public using (visibility='Public');

-- Authenticated users can read their own mixes (including private)
create policy "Users can read own mixes" on mixes for
select
  to authenticated using (created_by=auth.uid ());

-- Authenticated users can insert their own mixes
create policy "Users can insert own mixes" on mixes for insert to authenticated
with
  check (created_by=auth.uid ());

-- Authenticated users can update their own mixes
create policy "Users can update own mixes" on mixes
for update
  to authenticated using (created_by=auth.uid ())
with
  check (created_by=auth.uid ());

-- Authenticated users can delete their own mixes
create policy "Users can delete own mixes" on mixes for delete to authenticated using (created_by=auth.uid ());

-- RLS policies for mix_recipes table
-- Users can read recipes for mixes they own
create policy "Users can read own mix recipes" on mix_recipes for
select
  to authenticated using (
    exists (
      select
        1
      from
        mixes
      where
        mixes.id=mix_recipes.parent_ingredient_id
        and mixes.created_by=auth.uid ()
    )
  );

-- Users can read recipes for public mixes
create policy "Public can read public mix recipes" on mix_recipes for
select
  to public using (
    exists (
      select
        1
      from
        mixes
      where
        mixes.id=mix_recipes.parent_ingredient_id
        and mixes.visibility='Public'
    )
  );

-- Users can insert recipes for their own mixes
create policy "Users can insert own mix recipes" on mix_recipes for insert to authenticated
with
  check (
    exists (
      select
        1
      from
        mixes
      where
        mixes.id=mix_recipes.parent_ingredient_id
        and mixes.created_by=auth.uid ()
    )
  );

-- Users can update recipes for their own mixes
create policy "Users can update own mix recipes" on mix_recipes
for update
  to authenticated using (
    exists (
      select
        1
      from
        mixes
      where
        mixes.id=mix_recipes.parent_ingredient_id
        and mixes.created_by=auth.uid ()
    )
  )
with
  check (
    exists (
      select
        1
      from
        mixes
      where
        mixes.id=mix_recipes.parent_ingredient_id
        and mixes.created_by=auth.uid ()
    )
  );

-- Users can delete recipes for their own mixes
create policy "Users can delete own mix recipes" on mix_recipes for delete to authenticated using (
  exists (
    select
      1
    from
      mixes
    where
      mixes.id=mix_recipes.parent_ingredient_id
      and mixes.created_by=auth.uid ()
  )
);

-- RLS policies for user_preferences table
-- Users can only access their own preferences
create policy "Users can read own preferences" on user_preferences for
select
  to authenticated using (user_id=auth.uid ());

create policy "Users can insert own preferences" on user_preferences for insert to authenticated
with
  check (user_id=auth.uid ());

create policy "Users can update own preferences" on user_preferences
for update
  to authenticated using (user_id=auth.uid ())
with
  check (user_id=auth.uid ());

create policy "Users can delete own preferences" on user_preferences for delete to authenticated using (user_id=auth.uid ());

-- Create indexes for better performance
create index idx_mixes_created_by on mixes (created_by);

create index idx_mixes_visibility on mixes (visibility);

create index idx_mix_recipes_parent_ingredient on mix_recipes (parent_ingredient_id);

create index idx_user_preferences_user_id on user_preferences (user_id);

create index idx_user_preferences_type on user_preferences (preference_type);