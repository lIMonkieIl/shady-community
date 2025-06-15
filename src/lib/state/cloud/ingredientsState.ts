import { createClient } from "@/lib/supabase/client";
import { observable } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";

const supabase = createClient();

export const ingredientsState$ = observable(
	syncedSupabase({
		supabase,
		collection: "ingredients",
		persist: {
			name: "ingredients",
			plugin: ObservablePersistLocalStorage,
			retrySync: true,
		},
		actions: ["read"],
		realtime: true,
		fieldCreatedAt: "created_at",
		fieldUpdatedAt: "updated_at",
		filter: (select) => select.eq("visibility", "System").eq("is_custom", false),
	}),
);

export const getIngredientById = (ingredientId: string) => {
	return ingredientsState$[ingredientId].get();
};
