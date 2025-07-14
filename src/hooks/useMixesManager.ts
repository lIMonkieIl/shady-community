import { user_MixesRecipes$ } from "@/lib/state/cloud/userMixesRecipes";
import { user_mixes$ } from "@/lib/state/cloud/userMixesState";
// import { authState$ } from "@/lib/state/local/authState";
// import { local_mixesRecipes$ } from "@/lib/state/local/localMixRecipes";
// import { local_mixes$ } from "@/lib/state/local/localMixes";
import type { Database, Tables } from "@/lib/types/supabase.types";
import { batch } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";
import { v4 as uuidv4 } from "uuid";
import { useIngredientsManager } from "./useIngredientsManager";
import { type IUseMixManagerState, mixManagerErrorState$ } from "./useMixManager";

export interface IMixRecipe extends Tables<"mix_recipes"> {}

export interface IMix extends Omit<Tables<"mixes">, "created_by"> {}

interface IUseMixesManagerState {
	mixes: Record<string, IMix>;
	recipes: Record<string, IMixRecipe>;
}
interface IUseMixesManagerActions {
	addMix: (curMixState: IUseMixManagerState) => { success: boolean; message: string };
	getMixRecipe: (mixId: string) => IMixRecipe[] | undefined;
	removeMix: (mixId: string) => void;
	migrateOldMixes: (data: FullMixData | undefined) => {
		success: string[];
		failed: { name: string; error: string }[];
		summary: "No data provided.";
	};
}

interface IUseMixesManager {
	actions: IUseMixesManagerActions;
	state: IUseMixesManagerState;
}
export interface Ingredient {
	ingredientAmount: number;
	ingredientName: string;
}

export interface Purchase {
	location: string;
	costs: number;
}

export interface MixItem {
	name: string;
	addiction: number;
	category: "Mix" | "Pre-Mix";
	id: number;
	isWet: boolean;
	mixStrength: number;
	madeWith: Ingredient[];
	purchase: Purchase[];
	strength: number;
	toxicity: number;
}

export interface Mix {
	name: string;
	sellPerG: number;
	acetone: boolean;
	mixWeight: number;
	totalCost: number;
	mixStrVsVol: number;
	totalMixStr: number;
	mixAddiction: number;
	mixMixStrength: number;
	mixStrength: number;
	mixToxicity: number;
	maxWeightAllowed: number;
	items: unknown[];
}

export interface PersistState {
	version: number;
	rehydrated: boolean;
}

export interface FullMixData {
	mix: Mix;
	premixes: MixItem[];
	savedMixes: MixItem[];
	_persist: PersistState;
}

// const synced$ = computed(() => {
// 	const isAuthed = authState$.isAuthed.get();
// 	return isAuthed ? user_mixes$ : local_mixes$;
// });

// const syncedRecipe$ = computed(() => {
// 	const isAuthed = authState$.isAuthed.get();

// 	return isAuthed ? user_MixesRecipes$ : local_mixesRecipes$;
// });
export const useMixesManager = (): IUseMixesManager => {
	// const isAuthed = authState$.isAuthed.get();
	const state = use$(user_mixes$);
	const stateRecipe = use$(user_MixesRecipes$);
	const {
		actions: { getIngredientByName },
	} = useIngredientsManager();
	const actions: IUseMixesManagerActions = {
		addMix: (curMix) => {
			const hasState = state && Object.keys(state).length > 0;

			if (hasState) {
				const found = Object.values(state).find(
					(item) =>
						item.name === curMix.currentMixData.name &&
						item.category === curMix.currentMixData.category,
				);

				if (found) {
					return {
						success: false,
						message: `You already have a ${curMix.currentMixData.category} with that name`,
					};
				}
			}

			const canSave = mixManagerErrorState$.canSave;
			if (!canSave) {
				return {
					success: false,
					message: "Please check for validation errors",
				};
			}

			const { mix, recipe } = convertCurMix(curMix);
			// if (isAuthed) {
			const { created_at, updated_at, ...rest } = mix;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			user_mixes$[mix.id].set({ ...rest } as any);
			// } else {
			// user_mixes$[mix.id].set(mix);
			// }

			batch(() => {
				for (const recipeItem of recipe) {
					// if (isAuthed) {
					const { created_at, updated_at, ...rest } = recipeItem;
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					user_MixesRecipes$[recipeItem.id].set(rest as any);
					// } else {
					// local_mixesRecipes$[recipeItem.id].set(recipeItem);
					// }
				}
			});

			return {
				success: true,
				message: "Saved",
			};
		},

		getMixRecipe(mixId) {
			const recipe = Object.values(stateRecipe).filter(
				(item) => item.parent_ingredient_id === mixId,
			);
			if (!recipe) {
				return undefined;
			}
			return recipe;
		},
		removeMix: (mixId) => {
			user_mixes$[mixId].delete();
		},
		migrateOldMixes: (data) => {
			if (!data) {
				return {
					success: [],
					failed: [],
					summary: "No data provided.",
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				} as any;
			}

			const results = {
				success: [] as string[],
				failed: [] as { name: string; error: string }[],
			};

			const now = new Date().toISOString();

			const migrateSingleMix = ({
				data,
				category,
			}: { data: MixItem; category: "Mix" | "Pre-Mix" }) => {
				const mixId = uuidv4();
				const parent = getIngredientByName(data.madeWith[0]?.ingredientName);
				if (!parent) {
					results.failed.push({
						name: data.name,
						error: "Parent ingredient not found",
					});
					return;
				}

				const recipe: IMixRecipe[] = [];

				for (const [index, madeWith] of data.madeWith.entries()) {
					const child = getIngredientByName(madeWith.ingredientName);
					if (!child) {
						results.failed.push({
							name: data.name,
							error: `Child ingredient '${madeWith.ingredientName}' not found`,
						});
						return;
					}

					recipe.push({
						amount: madeWith.ingredientAmount,
						child_ingredient_id: child.id,
						id: uuidv4(),
						order_index: index,
						parent_ingredient_id: mixId,
						updated_at: now,
						created_at: now,
					});
				}

				const mix: IMix = {
					parent_ingredient_id: parent.id,
					addictiveness: Number.parseFloat(data.addiction.toFixed(2)),
					toxicity: Number.parseFloat(data.toxicity.toFixed(2)),
					strength: Number.parseFloat(data.strength.toFixed(2)),
					mix_strengthening: Number.parseFloat(data.mixStrength.toFixed(2)),
					category,
					description: null,
					type: parent.type,
					image: "",
					information: null,
					name: data.name,
					id: mixId,
					visibility: "Private",
					created_at: now,
					updated_at: now,
				};

				const { created_at, updated_at, ...restMix } = mix;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				user_mixes$[mix.id].set(restMix as any);

				batch(() => {
					for (const { created_at, updated_at, ...restRecipe } of recipe) {
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						user_MixesRecipes$[restRecipe.id].set(restRecipe as any);
					}
				});

				results.success.push(data.name);
			};

			// Safe fallback if either list is missing
			const premixes = Array.isArray(data.premixes) ? data.premixes : [];
			const mixes = Array.isArray(data.savedMixes) ? data.savedMixes : [];

			for (const premix of premixes) {
				migrateSingleMix({ data: premix, category: "Pre-Mix" });
			}

			for (const mix of mixes) {
				migrateSingleMix({ data: mix, category: "Mix" });
			}

			const summary =
				results.failed.length === 0
					? "All mixes migrated successfully."
					: `${results.success.length} succeeded, ${results.failed.length} failed.`;

			return {
				...results,
				summary,
			};
		},
	};

	return {
		actions,
		state: {
			mixes: state,
			recipes: stateRecipe,
		},
	};
};

const convertCurMix = (curMix: IUseMixManagerState) => {
	const generateId = () => uuidv4();
	const mixId = generateId();
	const now = new Date().toISOString();
	const mix: IMix = {
		parent_ingredient_id: curMix.currentMixData.parent_ingredient_id,
		addictiveness: curMix.currentMixData.addictiveness,
		toxicity: curMix.currentMixData.toxicity,
		strength: curMix.currentMixData.strength,
		mix_strengthening: curMix.currentMixData.mix_strengthening,
		type: curMix.currentMixData.type ?? "Powder",
		category:
			(curMix.currentMixData.category as Database["public"]["Enums"]["mix_category_enum"]) ?? "Mix",
		description: curMix.currentMixData.description,
		image: curMix.currentMixData.image,
		information: curMix.currentMixData.information,
		name: curMix.currentMixData.name,
		id: mixId,
		visibility: "Private",
		created_at: now,
		updated_at: now,
	};
	const recipe: IMixRecipe[] = curMix.currentMixData.recipe.map((ing, index) => {
		return {
			amount: ing.amount,
			child_ingredient_id: ing.child_ingredient_id,
			id: generateId(),
			order_index: index,
			parent_ingredient_id: mixId,
			created_at: now,
			updated_at: now,
		};
	});
	return { mix, recipe };
};
