create extension if not exists "pgjwt" with schema "extensions";


create table "public"."mix_recipes" (
    "id" uuid not null default gen_random_uuid(),
    "parent_ingredient_id" uuid not null,
    "child_ingredient_id" uuid not null,
    "amount" numeric not null,
    "order_index" numeric not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."mix_recipes" enable row level security;

create table "public"."mixes" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "category" text not null,
    "parent_ingredient_id" uuid not null,
    "description" text,
    "information" text,
    "image" text,
    "toxicity" numeric not null,
    "strength" numeric not null,
    "addictiveness" numeric not null,
    "mix_strengthening" numeric not null,
    "visibility" text not null default 'private'::text,
    "created_by" uuid not null default auth.uid(),
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now(),
    "isDeleted" boolean not null default false
);


alter table "public"."mixes" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "username" text,
    "avatar_url" text
);


alter table "public"."profiles" enable row level security;

create table "public"."user_preferences" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default auth.uid(),
    "preference_type" text not null,
    "value" jsonb not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."user_preferences" enable row level security;

CREATE INDEX idx_recipe_child ON public.mix_recipes USING btree (child_ingredient_id);

CREATE INDEX idx_recipe_order ON public.mix_recipes USING btree (parent_ingredient_id, order_index);

CREATE INDEX idx_recipe_parent ON public.mix_recipes USING btree (parent_ingredient_id);

CREATE INDEX idx_user_preferences_type ON public.user_preferences USING btree (preference_type);

CREATE INDEX idx_user_preferences_user_id ON public.user_preferences USING btree (user_id);

CREATE UNIQUE INDEX ingredient_recipes_pkey ON public.mix_recipes USING btree (id);

CREATE UNIQUE INDEX mixes_pkey1 ON public.mixes USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX user_preferences_pkey ON public.user_preferences USING btree (id);

alter table "public"."mix_recipes" add constraint "ingredient_recipes_pkey" PRIMARY KEY using index "ingredient_recipes_pkey";

alter table "public"."mixes" add constraint "mixes_pkey1" PRIMARY KEY using index "mixes_pkey1";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."user_preferences" add constraint "user_preferences_pkey" PRIMARY KEY using index "user_preferences_pkey";

alter table "public"."mix_recipes" add constraint "mix_recipes_parent_ingredient_id_fkey" FOREIGN KEY (parent_ingredient_id) REFERENCES mixes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."mix_recipes" validate constraint "mix_recipes_parent_ingredient_id_fkey";

alter table "public"."mixes" add constraint "mixes_created_by_fkey1" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."mixes" validate constraint "mixes_created_by_fkey1";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "username_length" CHECK ((char_length(username) >= 3)) not valid;

alter table "public"."profiles" validate constraint "username_length";

alter table "public"."user_preferences" add constraint "user_preferences_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_preferences" validate constraint "user_preferences_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_times()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        NEW.created_at := NOW();
        NEW.updated_at := NOW();
    ELSEIF (TG_OP = 'UPDATE') THEN
        NEW.created_at = OLD.created_at;
        NEW.updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_user_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  update public.profiles
  set 
    username = coalesce(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name'),
    avatar_url = new.raw_user_meta_data->>'avatar_url'
  where id = new.id;
  return new;
end;
$function$
;

grant delete on table "public"."mix_recipes" to "anon";

grant insert on table "public"."mix_recipes" to "anon";

grant references on table "public"."mix_recipes" to "anon";

grant select on table "public"."mix_recipes" to "anon";

grant trigger on table "public"."mix_recipes" to "anon";

grant truncate on table "public"."mix_recipes" to "anon";

grant update on table "public"."mix_recipes" to "anon";

grant delete on table "public"."mix_recipes" to "authenticated";

grant insert on table "public"."mix_recipes" to "authenticated";

grant references on table "public"."mix_recipes" to "authenticated";

grant select on table "public"."mix_recipes" to "authenticated";

grant trigger on table "public"."mix_recipes" to "authenticated";

grant truncate on table "public"."mix_recipes" to "authenticated";

grant update on table "public"."mix_recipes" to "authenticated";

grant delete on table "public"."mix_recipes" to "service_role";

grant insert on table "public"."mix_recipes" to "service_role";

grant references on table "public"."mix_recipes" to "service_role";

grant select on table "public"."mix_recipes" to "service_role";

grant trigger on table "public"."mix_recipes" to "service_role";

grant truncate on table "public"."mix_recipes" to "service_role";

grant update on table "public"."mix_recipes" to "service_role";

grant delete on table "public"."mixes" to "anon";

grant insert on table "public"."mixes" to "anon";

grant references on table "public"."mixes" to "anon";

grant select on table "public"."mixes" to "anon";

grant trigger on table "public"."mixes" to "anon";

grant truncate on table "public"."mixes" to "anon";

grant update on table "public"."mixes" to "anon";

grant delete on table "public"."mixes" to "authenticated";

grant insert on table "public"."mixes" to "authenticated";

grant references on table "public"."mixes" to "authenticated";

grant select on table "public"."mixes" to "authenticated";

grant trigger on table "public"."mixes" to "authenticated";

grant truncate on table "public"."mixes" to "authenticated";

grant update on table "public"."mixes" to "authenticated";

grant delete on table "public"."mixes" to "service_role";

grant insert on table "public"."mixes" to "service_role";

grant references on table "public"."mixes" to "service_role";

grant select on table "public"."mixes" to "service_role";

grant trigger on table "public"."mixes" to "service_role";

grant truncate on table "public"."mixes" to "service_role";

grant update on table "public"."mixes" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."user_preferences" to "anon";

grant insert on table "public"."user_preferences" to "anon";

grant references on table "public"."user_preferences" to "anon";

grant select on table "public"."user_preferences" to "anon";

grant trigger on table "public"."user_preferences" to "anon";

grant truncate on table "public"."user_preferences" to "anon";

grant update on table "public"."user_preferences" to "anon";

grant delete on table "public"."user_preferences" to "authenticated";

grant insert on table "public"."user_preferences" to "authenticated";

grant references on table "public"."user_preferences" to "authenticated";

grant select on table "public"."user_preferences" to "authenticated";

grant trigger on table "public"."user_preferences" to "authenticated";

grant truncate on table "public"."user_preferences" to "authenticated";

grant update on table "public"."user_preferences" to "authenticated";

grant delete on table "public"."user_preferences" to "service_role";

grant insert on table "public"."user_preferences" to "service_role";

grant references on table "public"."user_preferences" to "service_role";

grant select on table "public"."user_preferences" to "service_role";

grant trigger on table "public"."user_preferences" to "service_role";

grant truncate on table "public"."user_preferences" to "service_role";

grant update on table "public"."user_preferences" to "service_role";

create policy "Enable delete for users based on created_by in mixes"
on "public"."mix_recipes"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM mixes
  WHERE ((mixes.id = mix_recipes.parent_ingredient_id) AND (mixes.created_by = auth.uid())))));


create policy "Enable insert for authenticated users only"
on "public"."mix_recipes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for users based on created_by in mixes"
on "public"."mix_recipes"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM mixes
  WHERE ((mixes.id = mix_recipes.parent_ingredient_id) AND (mixes.created_by = auth.uid())))));


create policy "Enable update for users based on created_by in mixes"
on "public"."mix_recipes"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM mixes
  WHERE ((mixes.id = mix_recipes.parent_ingredient_id) AND (mixes.created_by = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM mixes
  WHERE ((mixes.id = mix_recipes.parent_ingredient_id) AND (mixes.created_by = auth.uid())))));


create policy "Enable delete for users based on user_id"
on "public"."mixes"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = created_by));


create policy "Enable insert for authenticated users only"
on "public"."mixes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable update for users based on user_id"
on "public"."mixes"
as permissive
for update
to authenticated
using ((created_by = auth.uid()));


create policy "Enable users to view their own data only"
on "public"."mixes"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by));


create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own preferences"
on "public"."user_preferences"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own preferences"
on "public"."user_preferences"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own preferences"
on "public"."user_preferences"
as permissive
for select
to public
using ((auth.uid() = user_id));


CREATE TRIGGER handle_ingredient_recipes_times BEFORE INSERT OR UPDATE ON public.mix_recipes FOR EACH ROW EXECUTE FUNCTION handle_times();

CREATE TRIGGER handle_profile_times BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION handle_times();

CREATE TRIGGER handle_user_preferences_times BEFORE INSERT OR UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION handle_times();


