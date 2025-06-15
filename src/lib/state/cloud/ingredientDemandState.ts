import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/types/supabase.types";
import { observable } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";

const supabase = createClient();

export const ingredientDemandState$ = observable(
	syncedSupabase({
		supabase,
		collection: "ingredient_demand",
		persist: {
			name: "ingredient_demand",
			plugin: ObservablePersistLocalStorage,
			retrySync: true,
		},
		actions: ["read"],
		realtime: true,
		fieldCreatedAt: "created_at",
		fieldUpdatedAt: "updated_at",
	}),
);
export const getDemandsByIngredientId = (ingredientId: string) => {
	return Object.entries(ingredientDemandState$.get())
		.filter(([_, demand]) => demand.ingredient_id === ingredientId)
		.reduce<Record<string, Tables<"ingredient_demand">>>((acc, [key, demand]) => {
			acc[key] = demand;
			return acc;
		}, {});
};

export type TIngredientDemandSector = "A" | "B" | "C";

export const getDemandsBySector = (sector: TIngredientDemandSector) => {
	return Object.entries(ingredientDemandState$.get())
		.filter(([_, demand]) => demand.sector === sector)
		.reduce<Record<string, Tables<"ingredient_demand">>>((acc, [key, demand]) => {
			acc[key] = demand;
			return acc;
		}, {});
};
