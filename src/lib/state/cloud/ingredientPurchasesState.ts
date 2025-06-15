import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/types/supabase.types";
import { observable } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";

const supabase = createClient();

export const ingredientPurchasesState$ = observable(
	syncedSupabase({
		supabase,
		collection: "ingredient_purchases",
		persist: {
			name: "ingredient_purchases",
			plugin: ObservablePersistLocalStorage,
			retrySync: true,
		},
		actions: ["read"],
		realtime: true,
		fieldCreatedAt: "created_at",
		fieldUpdatedAt: "updated_at",
	}),
);

export const getPurchasesByIngredientId = (ingredientId: string) => {
	return Object.entries(ingredientPurchasesState$.get())
		.filter(([_, purchase]) => purchase.ingredient_id === ingredientId)
		.reduce<Record<string, Tables<"ingredient_purchases">>>((acc, [key, purchase]) => {
			acc[key] = purchase;
			return acc;
		}, {});
};
export const getPurchaseById = (purchaseId: string) => {
	return Object.values(ingredientPurchasesState$.get()).find(
		(purchase) => purchase.id === purchaseId,
	);
};
