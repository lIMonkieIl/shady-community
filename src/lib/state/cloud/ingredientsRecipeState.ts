import { createClient } from "@/lib/supabase/client";
import { observable } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { v4 as uuidv4 } from "uuid";
import { authState$ } from "../local/authState";

const supabase = createClient();
const generateId = () => uuidv4();
export const ingredientRecipesState$ = observable(
	syncedSupabase({
		supabase,
		collection: "ingredient_recipes",
		persist: {
			name: "recipes",
			plugin: ObservablePersistLocalStorage,
			retrySync: true,
		},
		filter: (select) => select.eq("parent_ingredient_created_by", authState$.user.id.get() ?? ""),
		realtime: {
			schema: "public",
			filter: `parent_ingredient_created_by=eq.${authState$.user.id.get()}`,
		},
		generateId,
		fieldCreatedAt: "created_at",
		fieldUpdatedAt: "updated_at",
		retry: { infinite: true },
		waitFor: authState$.isAuthed,
	}),
);
