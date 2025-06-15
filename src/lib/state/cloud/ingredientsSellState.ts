import { createClient } from "@/lib/supabase/client";
import { observable } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";

const supabase = createClient();

export const ingredientSellPricesState$ = observable(
	syncedSupabase({
		supabase,
		collection: "ingredient_sell_prices",
		persist: {
			name: "ingredient_sell_prices",
			plugin: ObservablePersistLocalStorage,
			retrySync: true,
		},
		actions: ["read"],
		realtime: true,
		fieldId: "ingredient_id",
		fieldCreatedAt: "created_at",
		fieldUpdatedAt: "updated_at",
	}),
);
export const getSellPriceByIngredientId = (ingredientId: string) => {
	return ingredientSellPricesState$[ingredientId].get();
};
