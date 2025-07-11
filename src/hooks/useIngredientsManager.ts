import { user_mixes$ } from "@/lib/state/cloud/userMixesState";
// import { authState$ } from "@/lib/state/local/authState";
// import { local_mixes$ } from "@/lib/state/local/localMixes";
import type { Tables } from "@/lib/types/supabase.types";
import { computed, observable } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";
import IngredientDemandData from "../lib/data/ingredient_demands.json";
import IngredientPurchaseData from "../lib/data/ingredient_purchases.json";
import IngredientSellPriceData from "../lib/data/ingredient_sell_prices.json";
import IngredientData from "../lib/data/ingredients.json";
import type { IMix } from "./useMixesManager";

type TIngredientCategory = "Additive" | "Drug" | "Filler";

type TIngredientType =
	| "Liquid"
	| "Powder"
	| "Crystal"
	| "Pills"
	| "Granulate"
	| "Dried Plant"
	| "Mushrooms";

export type TIngredientDemandSector = "A" | "B" | "C";

export type TIngredientPurchaseOptionSource =
	| "Local Shop"
	| "Gas Station"
	| "Eddie"
	| "Small Lab"
	| "Large Lab"
	| "Supermarket"
	| "Downtown"
	| "West Deadtown"
	| "Mid Deadtown"
	| "Bad Asia"
	| "Tower Blocks"
	| "Construction"
	| "Fancy Hill"
	| "Commune"
	| "Factory South"
	| "Factory North"
	| "Drug Store"
	| "Walther"
	| "Jamie's Pharmacy"
	| "Grocery Store"
	| "Ghetto Kush"
	| "Bong Breaker"
	| "Firecracker"
	| "Stoner Haze"
	| "AK-420"
	| "Brainfuck"
	| "Dubai Sativa";

export interface IIngredientPurchaseOption {
	id: string;
	ingredient_id: string;
	source: TIngredientPurchaseOptionSource;
	price: number;
}

export interface IIngredientSellPrice {
	ingredient_id: string;
	min_price: number;
	max_price: number;
}

export type TIngredientDemandLocation =
	| "East Oldtown"
	| "West Oldtown"
	| "Two Towers"
	| "Old Market"
	| "Stink"
	| "Kennel"
	| "Eastern Slums"
	| "Supermarket"
	| "Downtown"
	| "West Deadtown"
	| "Mid Deadtown"
	| "Bad Asia"
	| "Tower Blocks"
	| "Construction"
	| "Fancy Hill"
	| "Commune"
	| "Factory South"
	| "Factory North"
	| "East Deadtown"
	| "Camp";

export interface IIngredientDemand {
	id: string;
	ingredient_id: string;
	sector: TIngredientDemandSector;
	location: TIngredientDemandLocation;
	demand_value: number;
}

export interface IIngredient {
	id: string;
	name: string;
	category: TIngredientCategory;
	type: TIngredientType;
	image: string;
	description: string;
	information: string;
	toxicity: number;
	strength: number;
	addictiveness: number;
	mix_strengthening: number;
}

interface IUseIngredientsManagerActions {
	getIngredientById: (ingredientId: string) => IIngredient | IMix | undefined;
	getIngredientByName: (ingredientName: string) => IIngredient | IMix | undefined;
	getIngredientSellPriceByIngredientId: (ingredientId: string) => IIngredientSellPrice | undefined;
	getIngredientPurchasesByIngredientId: (
		ingredientId: string,
	) => IIngredientPurchaseOption[] | undefined;
	getIngredientDemandsByIngredientId: (ingredientId: string) => IIngredientDemand[] | undefined;
	getIngredientDemandsBySector: (
		sector: TIngredientDemandSector,
	) => IIngredientDemand[] | undefined;
	getIngredientPurchaseById: (purchaseId: string) => IIngredientPurchaseOption | undefined;
}

interface IUseIngredientsManager {
	actions: IUseIngredientsManagerActions;
	state: IUseIngredientsManagerState;
}

function buildIngredients(): Record<string, IIngredient> {
	return Object.fromEntries(
		IngredientData.map((ingredient) => [ingredient.id, ingredient as IIngredient]),
	);
}

function buildIngredientDemands(): Record<string, IIngredientDemand> {
	return Object.fromEntries(
		IngredientDemandData.map((demand) => [demand.id, demand as IIngredientDemand]),
	);
}

function buildIngredientPurchases(): Record<string, IIngredientPurchaseOption> {
	return Object.fromEntries(
		IngredientPurchaseData.map((purchase) => [
			purchase.id,
			{
				...purchase,
				source: purchase.source as TIngredientPurchaseOptionSource,
			},
		]),
	);
}

function buildIngredientSellPrices(): Record<string, IIngredientSellPrice> {
	return Object.fromEntries(
		IngredientSellPriceData.map((sellPrice) => [
			sellPrice.ingredient_id,
			{
				...sellPrice,
			},
		]),
	);
}

export const allPurchases$ = observable(buildIngredientPurchases());
export const allSellPrices$ = observable(buildIngredientSellPrices());
export const allDemands$ = observable(buildIngredientDemands());
export const ingredients$ = observable(buildIngredients());

// const syncedMixes$ = computed(() => {
// 	const isAuthed = authState$.isAuthed.get();
// 	return isAuthed ? user_mixes$ : local_mixes$;
// });

export const allIngredients$ = computed<
	Record<string, IIngredient | Omit<Tables<"mixes">, "created_by">>
>(() => {
	return {
		...ingredients$,
		...user_mixes$,
	};
});

interface IUseIngredientsManagerState {
	allPurchases: Record<string, IIngredientPurchaseOption>;
	allSellPrices: Record<string, IIngredientSellPrice>;
	allDemands: Record<string, IIngredientDemand>;
	allIngredients: Record<string, IIngredient | Omit<Tables<"mixes">, "created_by">>;
}

export const useIngredientsManager = (): IUseIngredientsManager => {
	const allPurchases = use$(allPurchases$);
	const allSellPrices = use$(allSellPrices$);
	const allDemands = use$(allDemands$);
	const allIngredients = use$(allIngredients$.get());

	const actions: IUseIngredientsManagerActions = {
		getIngredientById: (ingredientId) => {
			const ingredient = allIngredients[ingredientId];
			if (!ingredient) {
				return undefined;
			}
			return ingredient;
		},

		getIngredientByName: (ingredientName) => {
			const ingredient = Object.values(allIngredients).find(
				(ingredient) => ingredient.name.toLowerCase() === ingredientName.toLowerCase(),
			);
			if (!ingredient) {
				return undefined;
			}
			return ingredient;
		},
		getIngredientDemandsByIngredientId: (ingredientId) => {
			const demands = Object.values(allDemands).filter(
				(demand) => demand.ingredient_id === ingredientId,
			);
			if (demands.length === 0) {
				return undefined;
			}
			return demands;
		},
		getIngredientPurchasesByIngredientId: (ingredientId) => {
			const purchases = Object.values(allPurchases).filter(
				(demand) => demand.ingredient_id === ingredientId,
			);
			if (!purchases) {
				return undefined;
			}
			return purchases;
		},
		getIngredientSellPriceByIngredientId: (ingredientId) => {
			const sellPrice = allSellPrices[ingredientId];
			if (!sellPrice) {
				return undefined;
			}
			return sellPrice;
		},
		getIngredientDemandsBySector: (sector) => {
			const demands = Object.values(allDemands).filter((demand) => demand.sector === sector);
			if (!demands) {
				return undefined;
			}
			return demands;
		},
		getIngredientPurchaseById: (purchaseId) => {
			const purchase = allPurchases[purchaseId];
			if (!purchase) {
				return undefined;
			}
			return purchase;
		},
	};
	return {
		actions,
		state: {
			allDemands,
			allSellPrices,
			allPurchases,
			allIngredients,
		},
	};
};
