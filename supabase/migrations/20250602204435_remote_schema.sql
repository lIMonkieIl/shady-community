

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_ingredient_market_data"("ingredient_uuid" "uuid") RETURNS TABLE("purchases" "json", "sell_prices" "json", "demand" "json")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  base_ingredient_id UUID;
  is_custom_ingredient BOOLEAN;
BEGIN
  -- Check if this is a custom ingredient
  SELECT ingredients.is_custom INTO is_custom_ingredient
  FROM ingredients 
  WHERE id = ingredient_uuid;
  
  IF is_custom_ingredient = true THEN
    -- Get the first ingredient in the recipe (lowest order_index)
    SELECT child_ingredient_id INTO base_ingredient_id
    FROM ingredient_recipes 
    WHERE parent_ingredient_id = ingredient_uuid 
    ORDER BY order_index 
    LIMIT 1;
    
    -- For custom ingredients: no purchases (empty array), but get sell_prices and demand from base ingredient
    RETURN QUERY
    SELECT 
      '[]'::json as purchases, -- Custom ingredients have no purchases
      (SELECT json_build_object(
        'min_price', s.min_price,
        'max_price', s.max_price
      ) FROM ingredient_sell_prices s WHERE s.ingredient_id = base_ingredient_id LIMIT 1) as sell_prices,
      (SELECT json_agg(json_build_object(
        'sector', d.sector,
        'location', d.location,
        'demand_value', d.demand_value
      )) FROM ingredient_demand d WHERE d.ingredient_id = base_ingredient_id) as demand;
  ELSE
    -- For regular ingredients: return all market data including purchases
    RETURN QUERY
    SELECT 
      (SELECT json_agg(json_build_object(
        'id', p.id,
        'source', p.source,
        'price', p.price
      )) FROM ingredient_purchases p WHERE p.ingredient_id = ingredient_uuid) as purchases,
      (SELECT json_build_object(
        'min_price', s.min_price,
        'max_price', s.max_price
      ) FROM ingredient_sell_prices s WHERE s.ingredient_id = ingredient_uuid LIMIT 1) as sell_prices,
      (SELECT json_agg(json_build_object(
        'sector', d.sector,
        'location', d.location,
        'demand_value', d.demand_value
      )) FROM ingredient_demand d WHERE d.ingredient_id = ingredient_uuid) as demand;
  END IF;
END;
$$;


ALTER FUNCTION "public"."get_ingredient_market_data"("ingredient_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."ingredient_demand" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ingredient_id" "uuid" NOT NULL,
    "sector" character varying(10) NOT NULL,
    "location" character varying(100) NOT NULL,
    "demand_value" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "ingredient_demand_sector_check" CHECK ((("sector")::"text" = ANY ((ARRAY['A'::character varying, 'B'::character varying, 'C'::character varying])::"text"[])))
);


ALTER TABLE "public"."ingredient_demand" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ingredient_purchases" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ingredient_id" "uuid" NOT NULL,
    "source" character varying(100) NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."ingredient_purchases" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ingredient_recipes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "parent_ingredient_id" "uuid" NOT NULL,
    "child_ingredient_id" "uuid" NOT NULL,
    "amount" integer NOT NULL,
    "order_index" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."ingredient_recipes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ingredient_sell_prices" (
    "ingredient_id" "uuid" NOT NULL,
    "min_price" numeric(10,2) NOT NULL,
    "max_price" numeric(10,2) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."ingredient_sell_prices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ingredients" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "category" character varying(50) NOT NULL,
    "type" character varying(50) NOT NULL,
    "image" character varying(255),
    "description" "text",
    "information" "text",
    "toxicity" numeric(5,2) NOT NULL,
    "strength" numeric(5,2) NOT NULL,
    "addictiveness" numeric(5,2) NOT NULL,
    "mix_strengthening" numeric(5,2) NOT NULL,
    "is_custom" boolean DEFAULT false NOT NULL,
    "visibility" character varying(20) DEFAULT 'Private'::character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "ingredients_category_check" CHECK ((("category")::"text" = ANY ((ARRAY['Additive'::character varying, 'Drug'::character varying, 'Filler'::character varying, 'Mix'::character varying, 'Pre-mix'::character varying])::"text"[]))),
    CONSTRAINT "ingredients_type_check" CHECK ((("type")::"text" = ANY ((ARRAY['Liquid'::character varying, 'Powder'::character varying, 'Crystal'::character varying, 'Pills'::character varying, 'Granulate'::character varying, 'Dried Plant'::character varying, 'Mushrooms'::character varying])::"text"[]))),
    CONSTRAINT "ingredients_visibility_check" CHECK ((("visibility")::"text" = ANY ((ARRAY['Private'::character varying, 'Public'::character varying, 'System'::character varying])::"text"[])))
);


ALTER TABLE "public"."ingredients" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "username" "text",
    "avatar_url" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "preference_type" "text" NOT NULL,
    "value" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_preferences" OWNER TO "postgres";


ALTER TABLE ONLY "public"."ingredient_demand"
    ADD CONSTRAINT "ingredient_demand_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ingredient_purchases"
    ADD CONSTRAINT "ingredient_purchases_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ingredient_recipes"
    ADD CONSTRAINT "ingredient_recipes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ingredient_sell_prices"
    ADD CONSTRAINT "ingredient_sell_prices_pkey" PRIMARY KEY ("ingredient_id");



ALTER TABLE ONLY "public"."ingredients"
    ADD CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_demand_ingredient" ON "public"."ingredient_demand" USING "btree" ("ingredient_id");



CREATE INDEX "idx_ingredients_category" ON "public"."ingredients" USING "btree" ("category");



CREATE INDEX "idx_ingredients_created_by" ON "public"."ingredients" USING "btree" ("created_by");



CREATE INDEX "idx_ingredients_is_custom" ON "public"."ingredients" USING "btree" ("is_custom");



CREATE INDEX "idx_ingredients_visibility" ON "public"."ingredients" USING "btree" ("visibility");



CREATE INDEX "idx_purchases_ingredient" ON "public"."ingredient_purchases" USING "btree" ("ingredient_id");



CREATE INDEX "idx_recipe_child" ON "public"."ingredient_recipes" USING "btree" ("child_ingredient_id");



CREATE INDEX "idx_recipe_order" ON "public"."ingredient_recipes" USING "btree" ("parent_ingredient_id", "order_index");



CREATE INDEX "idx_recipe_parent" ON "public"."ingredient_recipes" USING "btree" ("parent_ingredient_id");



CREATE INDEX "idx_sell_prices_ingredient" ON "public"."ingredient_sell_prices" USING "btree" ("ingredient_id");



CREATE INDEX "idx_user_preferences_type" ON "public"."user_preferences" USING "btree" ("preference_type");



CREATE INDEX "idx_user_preferences_user_id" ON "public"."user_preferences" USING "btree" ("user_id");



ALTER TABLE ONLY "public"."ingredient_demand"
    ADD CONSTRAINT "ingredient_demand_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ingredient_purchases"
    ADD CONSTRAINT "ingredient_purchases_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ingredient_recipes"
    ADD CONSTRAINT "ingredient_recipes_child_ingredient_id_fkey" FOREIGN KEY ("child_ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ingredient_recipes"
    ADD CONSTRAINT "ingredient_recipes_parent_ingredient_id_fkey" FOREIGN KEY ("parent_ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ingredient_sell_prices"
    ADD CONSTRAINT "ingredient_sell_prices_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ingredients"
    ADD CONSTRAINT "ingredients_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Creators can delete their custom ingredients" ON "public"."ingredients" FOR DELETE USING ((("created_by" = "auth"."uid"()) AND ("is_custom" = true)));



CREATE POLICY "Creators can update their custom ingredients" ON "public"."ingredients" FOR UPDATE USING ((("created_by" = "auth"."uid"()) AND ("is_custom" = true)));



CREATE POLICY "Demand visible based on ingredient visibility" ON "public"."ingredient_demand" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."ingredients"
  WHERE (("ingredients"."id" = "ingredient_demand"."ingredient_id") AND ((("ingredients"."visibility")::"text" = 'System'::"text") OR (("ingredients"."visibility")::"text" = 'Public'::"text") OR ((("ingredients"."visibility")::"text" = 'Private'::"text") AND ("ingredients"."created_by" = "auth"."uid"())))))));



CREATE POLICY "Private ingredients for creator only" ON "public"."ingredients" FOR SELECT USING ((("created_by" = "auth"."uid"()) AND (("visibility")::"text" = 'Private'::"text")));



CREATE POLICY "Public ingredients visible to all" ON "public"."ingredients" FOR SELECT USING ((("visibility")::"text" = 'Public'::"text"));



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Purchases visible based on ingredient visibility" ON "public"."ingredient_purchases" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."ingredients"
  WHERE (("ingredients"."id" = "ingredient_purchases"."ingredient_id") AND ((("ingredients"."visibility")::"text" = 'System'::"text") OR (("ingredients"."visibility")::"text" = 'Public'::"text") OR ((("ingredients"."visibility")::"text" = 'Private'::"text") AND ("ingredients"."created_by" = "auth"."uid"())))))));



CREATE POLICY "Recipe components visible based on parent ingredient" ON "public"."ingredient_recipes" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."ingredients"
  WHERE (("ingredients"."id" = "ingredient_recipes"."parent_ingredient_id") AND ((("ingredients"."visibility")::"text" = 'System'::"text") OR (("ingredients"."visibility")::"text" = 'Public'::"text") OR ((("ingredients"."visibility")::"text" = 'Private'::"text") AND ("ingredients"."created_by" = "auth"."uid"())))))));



CREATE POLICY "Sell prices visible based on ingredient visibility" ON "public"."ingredient_sell_prices" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."ingredients"
  WHERE (("ingredients"."id" = "ingredient_sell_prices"."ingredient_id") AND ((("ingredients"."visibility")::"text" = 'System'::"text") OR (("ingredients"."visibility")::"text" = 'Public'::"text") OR ((("ingredients"."visibility")::"text" = 'Private'::"text") AND ("ingredients"."created_by" = "auth"."uid"())))))));



CREATE POLICY "System ingredients visible to all" ON "public"."ingredients" FOR SELECT USING ((("visibility")::"text" = 'System'::"text"));



CREATE POLICY "Users can create ingredients" ON "public"."ingredients" FOR INSERT WITH CHECK (("created_by" = "auth"."uid"()));



CREATE POLICY "Users can create recipes for their ingredients" ON "public"."ingredient_recipes" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."ingredients"
  WHERE (("ingredients"."id" = "ingredient_recipes"."parent_ingredient_id") AND ("ingredients"."created_by" = "auth"."uid"()) AND ("ingredients"."is_custom" = true)))));



CREATE POLICY "Users can delete recipes for their ingredients" ON "public"."ingredient_recipes" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."ingredients"
  WHERE (("ingredients"."id" = "ingredient_recipes"."parent_ingredient_id") AND ("ingredients"."created_by" = "auth"."uid"()) AND ("ingredients"."is_custom" = true)))));



CREATE POLICY "Users can insert their own preferences" ON "public"."user_preferences" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update recipes for their ingredients" ON "public"."ingredient_recipes" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."ingredients"
  WHERE (("ingredients"."id" = "ingredient_recipes"."parent_ingredient_id") AND ("ingredients"."created_by" = "auth"."uid"()) AND ("ingredients"."is_custom" = true)))));



CREATE POLICY "Users can update their own preferences" ON "public"."user_preferences" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own preferences" ON "public"."user_preferences" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."ingredient_demand" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ingredient_purchases" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ingredient_recipes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ingredient_sell_prices" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ingredients" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_preferences" ENABLE ROW LEVEL SECURITY;


CREATE PUBLICATION "powersync" FOR ALL TABLES WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION "powersync" OWNER TO "postgres";




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."profiles";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."user_preferences";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."get_ingredient_market_data"("ingredient_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_ingredient_market_data"("ingredient_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_ingredient_market_data"("ingredient_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



























GRANT ALL ON TABLE "public"."ingredient_demand" TO "anon";
GRANT ALL ON TABLE "public"."ingredient_demand" TO "authenticated";
GRANT ALL ON TABLE "public"."ingredient_demand" TO "service_role";
GRANT SELECT ON TABLE "public"."ingredient_demand" TO "powersync_role";



GRANT ALL ON TABLE "public"."ingredient_purchases" TO "anon";
GRANT ALL ON TABLE "public"."ingredient_purchases" TO "authenticated";
GRANT ALL ON TABLE "public"."ingredient_purchases" TO "service_role";
GRANT SELECT ON TABLE "public"."ingredient_purchases" TO "powersync_role";



GRANT ALL ON TABLE "public"."ingredient_recipes" TO "anon";
GRANT ALL ON TABLE "public"."ingredient_recipes" TO "authenticated";
GRANT ALL ON TABLE "public"."ingredient_recipes" TO "service_role";
GRANT SELECT ON TABLE "public"."ingredient_recipes" TO "powersync_role";



GRANT ALL ON TABLE "public"."ingredient_sell_prices" TO "anon";
GRANT ALL ON TABLE "public"."ingredient_sell_prices" TO "authenticated";
GRANT ALL ON TABLE "public"."ingredient_sell_prices" TO "service_role";
GRANT SELECT ON TABLE "public"."ingredient_sell_prices" TO "powersync_role";



GRANT ALL ON TABLE "public"."ingredients" TO "anon";
GRANT ALL ON TABLE "public"."ingredients" TO "authenticated";
GRANT ALL ON TABLE "public"."ingredients" TO "service_role";
GRANT SELECT ON TABLE "public"."ingredients" TO "powersync_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";
GRANT SELECT ON TABLE "public"."profiles" TO "powersync_role";



GRANT ALL ON TABLE "public"."user_preferences" TO "anon";
GRANT ALL ON TABLE "public"."user_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."user_preferences" TO "service_role";
GRANT SELECT ON TABLE "public"."user_preferences" TO "powersync_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
