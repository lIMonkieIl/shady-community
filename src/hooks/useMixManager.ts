import { toast } from "@/components/toast/toast";
import { user_currentMixSyncedState$ } from "@/lib/state/cloud/userCurrentMixSyncedState";
import { authState$ } from "@/lib/state/local/authState";
import { local_currentMixSyncedState$ } from "@/lib/state/local/localCurrentMixSyncedState";
import { clampNumber, isIngredient, isMixIngredient, validateField } from "@/lib/utils/helpers";
import { type Observable, computed, observable } from "@legendapp/state";
import { use$, useObserve } from "@legendapp/state/react";
import { z } from "zod";
import {
	type IIngredientDemand,
	allDemands$,
	allIngredients$,
	allPurchases$,
	allSellPrices$,
} from "./useIngredientsManager";

export type TIngredientCategory = "Mix" | "Pre-mix";
export type TIngredientType =
	| "Liquid"
	| "Powder"
	| "Crystal"
	| "Pills"
	| "Granulate"
	| "Dried Plant"
	| "Mushrooms";

interface IIngredientSellPrice {
	min_price: number;
	max_price: number;
}

type TIngredientDemandLocation =
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

type TIngredientDemandSector = "A" | "B" | "C";

interface ICurrentMixComputed {
	parent_ingredient_id: string;
	totalVolume: number;
	purity: number;
	cost: number;
	costPerGram: number;
	sellPriceTotal: number;
	profit: number;
	profitPerGram: number;
	profitFromCutting: number;
	profitFromMarkup: number;
	addedWeight: number;
	type: TIngredientType | null;
	toxicity: number;
	strength: number;
	addictiveness: number;
	mix_strengthening: number;
	recommended_sell_prices: IIngredientSellPrice | undefined;
	demand: IIngredientDemand[] | null;
	overdoseChance: number;
	addictionChance: number;
	// satisfiedWithMix: boolean;
}
interface IIngredientRecipe {
	key: string;
	amount: number;
	selected_purchase_option_id: string | null;
	child_ingredient_id: string;
	totalPrice: number;
}
interface TGangInput {
	isGangOrder: boolean;
	gangOrder: number;
	gangXP: number;
}

export interface ICurrentMix {
	name: string;
	image: string;
	sellPrice: number;
	category: TIngredientCategory;
	description: string | null;
	information: string | null;
	maxAllowedWeight: number;

	recipe: IIngredientRecipe[];
	gang: TGangInput;
	expectedQuality: number;
}

interface IConstMixData {
	highTox: number;
	minOD: number;
	minAddict: number;
	maxAddict: number;
	repFactor: number;
	clientSaleSatisfactionRange: number;
	maxGeneralSatisfaction: number;
	clientSatisfactionGeneral: number;
}

interface IUseMixManagerActions {
	setRecipeName: (name: string) => void;
	setRecipeDescription: (description: string) => void;
	setRecipeInformation: (information: string) => void;
	setRecipeImage: (imageURL: string) => void;
	setRecipeCategory: (category: TIngredientCategory) => void;
	setRecipeSellPrice: (price: number) => void;
	recipeAdd: (ingredientId: string) => void;
	recipeRemove: (ingredientId: string) => void;
	setRecipeOrderIndex: (ingredientId: string, newIndex: number) => void;
	setRecipeMainIngredient: (ingredientId: string) => void;
	moveUpRecipeIngredient: (ingredientId: string) => void;
	moveDownRecipeIngredient: (ingredientId: string) => void;
	swapRecipeIngredient: (ingredientId1: string, ingredientId2: string) => void;
	setRecipeIngredientAmount: (ingredientId: string, amount: number) => void;
	setRecipeIngredientPurchaseOption: (ingredientId: string, purchaseOptionId: string) => void;
	clearRecipe: () => void;
	resetMix: () => Promise<void>;
	getIngredientPurity: (ingredientWeight: number, totalWeight: number) => number;
	setMaxAllowedWeight: (weight: number) => void;
	scaleMix: (value: number, method: "multiply" | "divide") => void;
	scaleToLowest: () => void;
	scaleToMax: () => void;
	setISGangMix: (isGangMix: boolean) => void;
	loadMixFromShareink: (data: ICurrentMix) => void;
}

interface IComputedClientODData {
	clientODChance1: number;
	clientODChance2: number;
	clientODChance3: number;
	clientODChance4: number;
}
interface IClientAddicted {
	addictChance1: number;
	addictChance2: number;
	addictChance3: number;
	addictChance4: number;
	addictChance5: number;
}

interface IToxComputedData {
	relativeToxicity: number;
	status: "Pass" | "Fail";
	relativeStrength: number;
	relativeStrength1: number;
	purity1: number;
	purity2: number;
	purity3: "Pass" | "Fail";
}

interface IComputedGangStats {
	quality: number;
	gang: "Kenji" | "La Ballena" | undefined;
	cost: number;
	costTotal: number;
	sell: number;
	sellTotal: number;
	profit: number;
	profitPerGram: number;
	nextOrderDays: number;
	currentSatisfaction: number;
	maxSatisfaction: number;
	satisfactionProgress: number;
	intervalBonus: number;
	interval: number;
}

// interface IComputedClientExpectationAndSatisfaction {
// 	boom: number;
// 	// temp1: number;
// 	// temp2: number;
// 	// endProductQualityRatio: number;
// 	// clientExpectedQuality1: number;
// 	// clientExpectedQuality2: number;
// 	// clientSatisfaction1: number;
// 	// clientSatisfaction2: number;
// 	// clientSatisfaction3: number;
// 	// clientSatisfaction4: number;
// 	// clientSatisfaction5: number;
// }

interface IConstGangData {
	repPerDelivery: number;
	satisfactionStart: number;
	lastDayDelivery: number;
	wrongOrder: number;
	tooToxic: number;
	XPMax: number;
	minLevel: number;
	maxLevel: number;
	intervalMaxDrop: number;
	orderInterval: number;
}

const constGangData = {
	repPerDelivery: 80,
	satisfactionStart: 0,
	lastDayDelivery: -68,
	wrongOrder: -6,
	tooToxic: -15,
	XPMax: 1000,
	minLevel: 1,
	maxLevel: 10,
	intervalMaxDrop: 0.3,
	orderInterval: 36000,
} as IConstGangData;

const constMixData = {
	highTox: 12,
	minOD: 3.9,
	minAddict: 1,
	maxAddict: 13,
	repFactor: 100,
	clientSaleSatisfactionRange: 0.3,
	maxGeneralSatisfaction: 3,
} as IConstMixData;

// TODO Finish this
const toxComputedData$ = observable<IToxComputedData>({
	relativeToxicity: computed(() => {
		const recipe = synced$.recipe.get();
		const category = synced$.category.get();
		if (recipe.length === 0) {
			return 0;
		}
		if (category === "Pre-mix") {
			return 0;
		}
		const firstIngredientId = recipe[0]?.child_ingredient_id;
		const firstIngredient = allIngredients$[firstIngredientId].get();
		if (!firstIngredient) {
			return 0;
		}
		const tox = computedState$.toxicity.get();
		const firstIngredientTox = firstIngredient.toxicity;
		const relativeToxicity: number = tox / firstIngredientTox;
		return relativeToxicity;
	}),
	status: computed(() => {
		const relativeToxicity: number = toxComputedData$.relativeToxicity.get();
		const relativeToxicityMax = 1.8;
		const statusString: "Fail" | "Pass" = relativeToxicity >= relativeToxicityMax ? "Fail" : "Pass";
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		return statusString as any;
	}),
	relativeStrength: computed(() => {
		const recipe = synced$.recipe.get();
		if (recipe.length === 0) {
			return 0;
		}
		const firstIngredientId = recipe[0]?.child_ingredient_id;
		const firstIngredient = allIngredients$[firstIngredientId].get();
		if (!firstIngredient) {
			return 0;
		}
		const strength = computedState$.strength.get();
		const firstIngredientStrength = firstIngredient.strength;
		const relativeStrength: number = strength / firstIngredientStrength;
		return relativeStrength;
	}),
	purity1: computed(() => {
		const purity = computedState$.purity.get();
		const purity1 = purity / 100;
		return purity1;
	}),
	relativeStrength1: computed(() => {
		const purity1 = toxComputedData$.purity1.get();
		const relativeStrength1MinClamp = 1;
		const relativeStrength1MaxClamp = 1.22;
		const relativeStrength1 = clampNumber(
			purity1,
			relativeStrength1MinClamp,
			relativeStrength1MaxClamp,
		);
		return relativeStrength1;
	}),

	purity2: computed(() => {
		const purity1 = toxComputedData$.purity1.get();
		const relativeStrength1 = toxComputedData$.relativeStrength1.get();

		const purity2: number = purity1 * relativeStrength1;
		return purity2;
	}),
	purity3: computed(() => {
		const purity2: number = toxComputedData$.purity2.get();
		const purity1: number = toxComputedData$.purity1.get();

		const purity3: "Pass" | "Fail" = purity2 < purity1 ? "Fail" : "Pass";
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		return purity3 as any;
	}),
});

const computedGangStats$ = observable<IComputedGangStats | undefined>(() => {
	const data = {
		quality: computed(() => {
			const gang = computedGangStats$.gang.get();
			if (gang === "La Ballena") {
				return 85;
			}
			if (gang === "Kenji") {
				return 55;
			}
			return 0;
		}),
		gang: computed(() => {
			const recipe = synced$.recipe.get();
			const category = synced$.category.get();
			if (recipe.length === 0) {
				return undefined;
			}
			if (category === "Pre-mix") {
				return undefined;
			}
			const firstIngredientId = recipe[0]?.child_ingredient_id;
			const firstIngredient = allIngredients$[firstIngredientId].get();
			if (!firstIngredient) {
				return 0;
			}
			if (firstIngredient.name.toLowerCase() === "cocaine") {
				return "La Ballena";
			}
			if (firstIngredient.name.toLowerCase() === "crystal meth") {
				return "Kenji";
			}
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			return undefined as any;
		}),
		cost: computed(() => {
			const costPerGram: number = computedState$.costPerGram.get();
			return costPerGram;
		}),
		costTotal: computed(() => {
			const costPerGram: number = computedState$.costPerGram.get();
			const gangPackageSize = 50;
			const gangOrder = synced$.gang.gangOrder.get();
			const gangOrderTotal: number = gangOrder * gangPackageSize;
			const costTotal: number = costPerGram * gangOrderTotal;
			return costTotal;
		}),
		sell: computed(() => {
			const gang = computedGangStats$.gang.get();
			let sellPrice = 0;
			if (gang === "La Ballena") {
				sellPrice = 39;
			}
			if (gang === "Kenji") {
				sellPrice = 11;
			}

			return sellPrice;
		}),
		sellTotal: computed(() => {
			const gangOrder = synced$.gang.gangOrder.get();
			const gangPackageSize = 50;

			const gangOrderTotal: number = gangOrder * gangPackageSize;
			const sell = computedGangStats$.sell.get();
			const sellTotal: number = (sell ?? 0) * gangOrderTotal;
			return sellTotal;
		}),
		profit: computed(() => {
			const profitPerGram = computedGangStats$.profitPerGram.get();
			const gangOrder = synced$.gang.gangOrder.get();
			const gangPackageSize = 50;

			const gangOrderTotal: number = gangOrder * gangPackageSize;
			const profit: number = (profitPerGram ?? 0) * gangOrderTotal;
			return profit;
		}),
		profitPerGram: computed(() => {
			const sell = computedGangStats$.sell.get();
			const costPerGram = computedGangStats$.cost.get();
			const profitPerGram: number = (sell ?? 0) - (costPerGram ?? 0);
			return profitPerGram;
		}),
		nextOrderDays: computed(() => {
			const interval = computedGangStats$.interval.get();
			const nextOrderDays: number = (interval ?? 0) / 60 / 24;
			return nextOrderDays;
		}),
		currentSatisfaction: computed(() => {
			const minLevel = constGangData.minLevel;
			const xPMax = constGangData.XPMax;
			const gangXp = synced$.gang.gangXP.get();
			const currentSatisfaction = minLevel * xPMax + gangXp;
			return currentSatisfaction;
		}),
		maxSatisfaction: computed(() => {
			const maxLevel = constGangData.maxLevel;
			const gangXpMax = constGangData.XPMax;
			const maxSatisfaction = maxLevel * gangXpMax;
			return maxSatisfaction;
		}),
		satisfactionProgress: computed(() => {
			const currentGangSatisfaction = computedGangStats$.currentSatisfaction.get();
			const gangXpMax = constGangData.XPMax;
			const satisfactionProgress: number = (currentGangSatisfaction ?? 0) / gangXpMax;
			return satisfactionProgress;
		}),
		intervalBonus: computed(() => {
			const gangIntervalMaxDrop = constGangData.intervalMaxDrop;
			const satisfactionProgress = computedGangStats$.satisfactionProgress.get();
			const intervalBonus: number = gangIntervalMaxDrop * (satisfactionProgress ?? 0);
			return intervalBonus;
		}),
		interval: computed(() => {
			const orderInterval = constGangData.orderInterval;
			const intervalBonus = computedGangStats$.intervalBonus.get();
			const interval: number = orderInterval - orderInterval * (intervalBonus ?? 0);
			return interval;
		}),
	};

	const returnedData = synced$.gang.isGangOrder.get() ? data : undefined;
	return returnedData;
});

const computedClientODData$ = observable<IComputedClientODData>({
	clientODChance1: computed(() => {
		const currentMixTox = computedState$.toxicity.get();
		const minOD = constMixData.minOD;
		const clientODChance1: number = currentMixTox - minOD;
		return clientODChance1;
	}),
	clientODChance2: computed(() => {
		const clientODChance1 = computedClientODData$.clientODChance1.get();
		const minOD = constMixData.minOD;
		const clientODChance2: number = clientODChance1 / minOD;
		return clientODChance2;
	}),
	clientODChance3: computed(() => {
		const clientODChance2 = computedClientODData$.clientODChance2.get();
		const value = 20;
		const clientODChance3: number = clientODChance2 / value;
		return clientODChance3;
	}),
	clientODChance4: computed(() => {
		const clientODMaxClamp = 0.08;
		const clientODMinClamp = 0.001;
		const clientODChance3 = computedClientODData$.clientODChance3.get();
		const clientODChance4 = clampNumber(clientODChance3, clientODMinClamp, clientODMaxClamp);

		return clientODChance4;
	}),
});

const computedClientAddicted$ = observable<IClientAddicted>({
	addictChance1: computed(() => {
		const minAddict = constMixData.minAddict;
		const value = 2;
		const addictChance1: number = minAddict / value;
		return addictChance1;
	}),
	addictChance2: computed(() => {
		const minAddictiveness = computedState$.addictiveness.get();
		const addictChance1 = computedClientAddicted$.addictChance1.get();
		const addictChance2: number = minAddictiveness - addictChance1;
		return addictChance2;
	}),
	addictChance3: computed(() => {
		const addictChance2 = computedClientAddicted$.addictChance2.get();
		const maxAddictiveness = constMixData.maxAddict;

		const addictChance3: number = addictChance2 / maxAddictiveness;
		return addictChance3;
	}),
	addictChance4: computed(() => {
		const addictChance3 = computedClientAddicted$.addictChance3.get();
		const value = 3;

		const addictChance4: number = addictChance3 / value;
		return addictChance4;
	}),
	addictChance5: computed(() => {
		const addictChance4 = computedClientAddicted$.addictChance4.get();
		const clientAddictMaxClamp = 0.12;
		const clientAddictMinClamp = 0.01;

		const addictChance5 = clampNumber(addictChance4, clientAddictMinClamp, clientAddictMaxClamp);
		return addictChance5;
	}),
});

const computedState$ = observable<ICurrentMixComputed>({
	totalVolume: computed(() => {
		const recipe = synced$.recipe.get();
		const total = getMixTotalWeight(recipe);
		return total;
	}),
	purity: computed(() => {
		const recipe = synced$.recipe.get();
		const total = computedState$.totalVolume.get();
		if (recipe.length === 0) {
			return 0;
		}
		const firstAmount = recipe[0]?.amount;
		const purity = getMixPurity(firstAmount, total);
		return purity;
	}),
	cost: computed(() => {
		const recipe = synced$.recipe.get();
		if (recipe.length === 0) {
			return 0;
		}
		const added = recipe.reduce((sum, item) => sum + (item.totalPrice ?? 0), 0);
		return added;
	}),
	costPerGram: computed(() => {
		const cost = computedState$.cost.get();
		const total = computedState$.totalVolume.get();
		const perGram: number = cost / total;
		return perGram;
	}),
	sellPriceTotal: computed(() => {
		const sellPrice = synced$.sellPrice.get();
		const total = computedState$.totalVolume.get();
		const sellPriceTotal: number = sellPrice * total;
		return sellPriceTotal;
	}),
	profit: computed(() => {
		const sellPriceTotal = computedState$.sellPriceTotal.get();
		const cost = computedState$.cost.get();
		const profit: number = sellPriceTotal - cost;
		return profit;
	}),
	profitPerGram: computed(() => {
		const sellPrice = synced$.sellPrice.get();
		const costPerGram = computedState$.costPerGram.get();
		const profitPerGram: number = sellPrice - costPerGram;
		return profitPerGram;
	}),
	profitFromCutting: computed(() => {
		const sellPrice = synced$.sellPrice.get();
		const addedWeight = computedState$.addedWeight.get();
		const profitFromCutting: number = sellPrice * addedWeight;
		return profitFromCutting;
	}),
	profitFromMarkup: computed(() => {
		const profit = computedState$.profit.get();
		const profitFromCutting = computedState$.profitFromCutting.get();
		const profitFromMarkup: number = profit - profitFromCutting;
		return profitFromMarkup;
	}),
	addedWeight: computed(() => {
		const recipe = synced$.recipe.get();
		if (recipe.length === 0) {
			return 0;
		}
		const added = recipe.slice(1).reduce((sum, item) => sum + (item.amount ?? 0), 0);
		return added;
	}),
	type: computed(() => {
		const recipe = synced$.recipe.get();
		if (recipe.length === 0) {
			return null;
		}
		const firstIngredientId = recipe[0]?.child_ingredient_id;
		const firstIngredient = allIngredients$[firstIngredientId].get();
		if (!firstIngredient) {
			return null;
		}

		let returnType: TIngredientType | null = null;
		if (isIngredient(firstIngredient)) {
			returnType = firstIngredient.type;
		}
		if (isMixIngredient(firstIngredient)) {
			const parent = allIngredients$[firstIngredient.parent_ingredient_id].get();
			returnType = isIngredient(parent) ? parent.type : null;
		}
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		return returnType as any;
	}),
	toxicity: computed(() => {
		const recipe = synced$.recipe.get();
		const mixStr = computedState$.mix_strengthening.get();
		const total = computedState$.totalVolume.get();
		const tox = calculateProperty("toxicity", recipe, mixStr, total);
		return tox;
	}),
	strength: computed(() => {
		const recipe = synced$.recipe.get();
		const mixStr = computedState$.mix_strengthening.get();
		const total = computedState$.totalVolume.get();
		const strength = calculateProperty("strength", recipe, mixStr, total);
		return strength;
	}),
	addictiveness: computed(() => {
		const recipe = synced$.recipe.get();
		const mixStr = computedState$.mix_strengthening.get();
		const total = computedState$.totalVolume.get();
		const addictiveness = calculateProperty("addictiveness", recipe, mixStr, total);
		return addictiveness;
	}),
	mix_strengthening: computed(() => {
		const recipe = synced$.recipe.get();
		const total = computedState$.totalVolume.get();
		const mixStr = getMixStrengthMultiplier(recipe, total);
		return mixStr;
	}),
	recommended_sell_prices: computed(() => {
		const recipe = synced$.recipe.get();
		const category = synced$.category.get();
		const isGangMix = synced$.gang.isGangOrder.get();
		if (recipe.length === 0) {
			return undefined;
		}
		if (category === "Pre-mix") {
			return undefined;
		}
		if (isGangMix) {
			return undefined;
		}

		const firstIngredientId = recipe[0]?.child_ingredient_id;
		const sell = allSellPrices$[firstIngredientId].get();
		if (!sell) {
			return undefined;
		}
		return {
			min_price: sell.min_price,
			max_price: sell.max_price,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} as any;
	}),
	demand: computed(() => {
		const recipe = synced$.recipe.get();
		const category = synced$.category.get();
		if (recipe.length === 0) {
			return null;
		}
		if (category === "Pre-mix") {
			return null;
		}

		const firstIngredientId = recipe[0]?.child_ingredient_id;

		const fullIng = allIngredients$[firstIngredientId].get();

		let demands = null;
		if (isIngredient(fullIng)) {
			demands = Object.values(allDemands$.get()).filter(
				(demand) => demand.ingredient_id === firstIngredientId,
			);
		} else {
			demands = Object.values(allDemands$.get()).filter(
				(demand) => demand.ingredient_id === fullIng.parent_ingredient_id,
			);
		}

		if (!demands) {
			return null;
		}

		return Object.values(demands).map((demand) => {
			return {
				sector: demand.sector as TIngredientDemandSector,
				location: demand.location as TIngredientDemandLocation,
				demand_value: demand.demand_value,
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} as any;
		});
	}),
	addictionChance: computed(() => {
		const addictChance5 = computedClientAddicted$.addictChance5.get();
		const chance = addictChance5 * 100;
		return chance;
	}),
	overdoseChance: computed(() => {
		const clientODChance4 = computedClientODData$.clientODChance4.get();
		const chance = clientODChance4 * 100;
		return chance;
	}),
	parent_ingredient_id: computed(() => {
		const recipe = synced$.recipe.get();
		if (recipe.length === 0) {
			return "";
		}
		const firstIngredientId = recipe[0]?.child_ingredient_id;
		const firstIngredient = allIngredients$[firstIngredientId].get();
		if (!firstIngredient) {
			return "";
		}
		let id: string;
		if (isMixIngredient(firstIngredient)) {
			id = firstIngredient.parent_ingredient_id;
		} else {
			id = firstIngredient.id;
		}
		return id;
	}),
	// satisfiedWithMix: computed(() => {
	// 	const clientSatisfaction4 = computedClientExpectationAndSatisfaction$.clientSatisfaction4.get();
	// 	const satisfiedWithMix = clientSatisfaction4 > 0;
	// 	return satisfiedWithMix;
	// }),
});
// TODO Finish this
// const computedClientExpectationAndSatisfaction$ =
// 	observable<IComputedClientExpectationAndSatisfaction>({
// 		boom: computed(() => {
// 			const curMixStrength = computedState$.strength.get();
// 			const recipe = synced$.recipe.get();
// 			if (recipe.length === 0) {
// 				return 0;
// 			}
// 			const firstIngredientId = recipe[0].child_ingredient_id;
// 			const firstIngredient = getIngredientById(firstIngredientId);
// 			const firstIngredientStrength = firstIngredient.strength;
// 			const requestedStrength: number = curMixStrength / firstIngredientStrength;
// 			return 100;
// 		}),
// 		// temp1: computed(() => {
// 		// 	const purity = computedState$.purity.get();
// 		// 	const value = 0.2;
// 		// 	const temp1: number = (purity * value) / 100;
// 		// 	return temp1;
// 		// }),
// 		// temp2: computed(() => {
// 		// 	const temp1 = computedClientExpectationAndSatisfaction$.temp1.get();
// 		// 	const temp2MaxClamp = 1.5;
// 		// 	const temp2MinClamp = 0;
// 		// 	const value = 3;

// 		// 	const clamped: number = clampNumber(temp1, temp2MinClamp, temp2MaxClamp);
// 		// 	const temp2: number = clamped / value;
// 		// 	return temp2;
// 		// }),
// 		// endProductQualityRatio: computed(() => {
// 		// 	const temp1 = computedClientExpectationAndSatisfaction$.temp1.get();
// 		// 	const temp2 = computedClientExpectationAndSatisfaction$.temp2.get();
// 		// 	const purity = computedState$.purity.get();

// 		// 	const endProductQualityRatio: number = temp1 * temp2 + purity;
// 		// 	return endProductQualityRatio;
// 		// }),
// 		// clientExpectedQuality1: computed(() => {
// 		// 	const expectedQuality = synced$.expectedQuality.get();
// 		// 	const value = 0.2;
// 		// 	const clientExpectedQuality1: number = expectedQuality + value;
// 		// 	return clientExpectedQuality1;
// 		// }),
// 		// clientExpectedQuality2: computed(() => {
// 		// 	const clientExpectedQuality1 =
// 		// 		computedClientExpectationAndSatisfaction$.clientExpectedQuality1.get();
// 		// 	const value = 3;
// 		// 	const clientExpectedQuality2MinClamp = 0.4;
// 		// 	const clientExpectedQuality2MaxClamp = 0.9;
// 		// 	const clamped = clampNumber(
// 		// 		clientExpectedQuality1,
// 		// 		clientExpectedQuality2MinClamp,
// 		// 		clientExpectedQuality2MaxClamp,
// 		// 	);

// 		// 	const clientExpectedQuality2 = clamped / value;
// 		// 	return clientExpectedQuality2;
// 		// }),
// 		// clientSatisfaction1: computed(() => {
// 		// 	const endProductQualityRatio =
// 		// 		computedClientExpectationAndSatisfaction$.endProductQualityRatio.get();
// 		// 	const expectedQuality = synced$.expectedQuality.get();
// 		// 	const value = 0.95;
// 		// 	const clientSatisfaction1: number = endProductQualityRatio / expectedQuality - value;
// 		// 	return clientSatisfaction1;
// 		// }),
// 		// clientSatisfaction2: computed(() => {
// 		// 	const clientSatisfaction1 =
// 		// 		computedClientExpectationAndSatisfaction$.clientSatisfaction1.get();
// 		// 	const clientSaleSatisfactionRange = constMixData.clientSaleSatisfactionRange;

// 		// 	const clientSatisfaction2: number = clientSatisfaction1 * clientSaleSatisfactionRange;
// 		// 	return clientSatisfaction2;
// 		// }),
// 		// clientSatisfaction3: computed(() => {
// 		// 	const clientSatisfaction2 =
// 		// 		computedClientExpectationAndSatisfaction$.clientSatisfaction2.get();
// 		// 	const clientSatisfaction3MinClamp = -0.5;
// 		// 	const clientSatisfaction3MaxClamp = 0.25;
// 		// 	const clamped = clampNumber(
// 		// 		clientSatisfaction2,
// 		// 		clientSatisfaction3MinClamp,
// 		// 		clientSatisfaction3MaxClamp,
// 		// 	);
// 		// 	const value = 3;
// 		// 	const clientSatisfaction3: number = clamped / value;
// 		// 	return clientSatisfaction3;
// 		// }),
// 		// clientSatisfaction4: computed(() => {
// 		// 	const clientSatisfaction3 =
// 		// 		computedClientExpectationAndSatisfaction$.clientSatisfaction3.get();
// 		// 	const clientSatisfactionGeneral = constMixData.clientSatisfactionGeneral;

// 		// 	const clientSatisfaction4: number = clientSatisfaction3 + clientSatisfactionGeneral;
// 		// 	return clientSatisfaction4;
// 		// }),
// 		// clientSatisfaction5: computed(() => {
// 		// 	const clientSatisfaction4 =
// 		// 		computedClientExpectationAndSatisfaction$.clientSatisfaction4.get();
// 		// 	const clientSatisfaction5MinClamp = -1;
// 		// 	const clientSatisfaction5MaxClamp = constMixData.maxGeneralSatisfaction;
// 		// 	const clamped = clampNumber(
// 		// 		clientSatisfaction4,
// 		// 		clientSatisfaction5MinClamp,
// 		// 		clientSatisfaction5MaxClamp,
// 		// 	);
// 		// 	const value = 3;
// 		// 	const clientSatisfaction5: number = clamped / value;
// 		// 	return clientSatisfaction5;
// 		// }),
// 	});

const synced$ = computed(() => {
	const isAuthed = authState$.isAuthed.get();
	return isAuthed
		? (user_currentMixSyncedState$.value as Observable<ICurrentMix>)
		: local_currentMixSyncedState$;
});

export interface ICurrentMix {
	name: string;
	image: string;
	sellPrice: number;
	category: TIngredientCategory;
	description: string | null;
	information: string | null;
	maxAllowedWeight: number;

	recipe: IIngredientRecipe[];
	gang: TGangInput;
	expectedQuality: number;
}
type FieldErrors<T> = {
	[P in keyof T]?: string[] | null;
};

interface IErrorState {
	canSave: boolean;
	errors: FieldErrors<ICurrentMix> | null;
}

export const mixManagerErrorState$ = observable<IErrorState>({
	canSave: false,
	errors: null,
});
export interface IUseMixManagerState extends IErrorState {
	currentMixData: ICurrentMix &
		ICurrentMixComputed & {
			gangData: IComputedGangStats | undefined;
			miscData: IClientAddicted & IComputedClientODData & IToxComputedData;
		};
}
interface TUseMixManager {
	actions: IUseMixManagerActions;
	state: IUseMixManagerState;
}

export const useMixManager = (): TUseMixManager => {
	const currentMix = use$(synced$);
	const computedState = use$(computedState$);
	const computedGangStats = use$(computedGangStats$);
	const computedClientAddicted = use$(computedClientAddicted$);
	const computedClientODData = use$(computedClientODData$);
	const mixManagerErrorState = use$(mixManagerErrorState$);
	const toxComputedData = use$(toxComputedData$);
	observeCheckForAcetone();
	observeRecipeItemTotalPrice();
	observeCheckForCanSave();
	observeCheckForErrors();
	const isAuthed = use$(authState$.isAuthed);
	// const computedClientExpectationAndSatisfaction = use$(computedClientExpectationAndSatisfaction$);
	const actions: IUseMixManagerActions = {
		scaleToMax: () => {
			const targetMax = currentMix.maxAllowedWeight;
			const maxAllowedWeight = currentMix.maxAllowedWeight;
			const recipe = currentMix.recipe;

			if (!recipe.length || targetMax <= 0) return recipe.map(() => 0);

			// Calculate current total weight
			const currentTotal = recipe.reduce((a, b) => a + b.amount, 0);
			if (currentTotal <= 0) return recipe.map(() => 0);

			// Scale proportionally to reach target max weight
			// This preserves ratios, maintaining toxicity/strength
			let scalingFactor = targetMax / currentTotal;

			// Ensure we don't exceed maxAllowedWeight
			if (targetMax > maxAllowedWeight) {
				scalingFactor = maxAllowedWeight / currentTotal;
			}

			const targetTotal = Math.floor(currentTotal * scalingFactor);

			// Step 1: Scale each ingredient proportionally
			const scaled = recipe.map((val) => {
				const raw = val.amount * scalingFactor;
				return { ...val, amount: Math.floor(raw) };
			});

			// Step 2: Handle rounding differences
			const scaledTotal = scaled.reduce((a, b) => a + b.amount, 0);
			const diff = targetTotal - scaledTotal;

			// Step 3: Distribute remainder to preserve ratios
			if (diff > 0) {
				const remainders = recipe.map((val, i) => ({
					index: i,
					remainder: val.amount * scalingFactor - scaled[i].amount,
				}));

				remainders.sort((a, b) => b.remainder - a.remainder);

				for (let i = 0; i < diff && i < remainders.length; i++) {
					const index = remainders[i].index;
					if (scaled.reduce((a, b) => a + b.amount, 0) < maxAllowedWeight) {
						scaled[index].amount++;
					}
				}
			}

			return isAuthed
				? user_currentMixSyncedState$.value.recipe.set(scaled)
				: local_currentMixSyncedState$.recipe.set(scaled);
		},

		scaleToLowest: () => {
			console.log("scaling to lowest");
			const targetMin = 1;
			const maxAllowedWeight = currentMix.maxAllowedWeight;
			const recipe = currentMix.recipe;

			if (!recipe.length || targetMin <= 0) return recipe.map(() => 0);

			// Calculate current total weight
			const currentTotal = recipe.reduce((a, b) => a + b.amount, 0);
			if (currentTotal <= 0) return recipe.map(() => 0);

			// Find the minimum non-zero amount to determine scaling needed
			const validAmounts = recipe.map((val) => val.amount).filter((amount) => amount > 0);
			if (!validAmounts.length) return recipe.map(() => 0);
			const minAmount = Math.min(...validAmounts);

			// Calculate scaling factor to make smallest ingredient = targetMin
			let scalingFactor = targetMin / minAmount;

			// Check if scaling exceeds maxAllowedWeight
			let targetTotal = Math.floor(currentTotal * scalingFactor);
			if (targetTotal > maxAllowedWeight) {
				scalingFactor = maxAllowedWeight / currentTotal;
				targetTotal = Math.floor(currentTotal * scalingFactor);
			}

			// Step 1: Scale each ingredient proportionally
			const scaled = recipe.map((val) => {
				const raw = val.amount * scalingFactor;
				return { ...val, amount: Math.floor(raw) };
			});

			// Step 2: Handle rounding differences
			const scaledTotal = scaled.reduce((a, b) => a + b.amount, 0);
			const diff = targetTotal - scaledTotal;

			// Step 3: Distribute remainder to preserve ratios
			if (diff > 0) {
				const remainders = recipe.map((val, i) => ({
					index: i,
					remainder: val.amount * scalingFactor - scaled[i].amount,
				}));

				remainders.sort((a, b) => b.remainder - a.remainder);

				for (let i = 0; i < diff && i < remainders.length; i++) {
					const index = remainders[i].index;
					if (scaled.reduce((a, b) => a + b.amount, 0) < maxAllowedWeight) {
						scaled[index].amount++;
					}
				}
			}

			return isAuthed
				? user_currentMixSyncedState$.value.recipe.set(scaled)
				: local_currentMixSyncedState$.recipe.set(scaled);
		},

		scaleMix: (value, method) => {
			console.log("scaling mix");
			const maxAllowedWeight = currentMix.maxAllowedWeight;
			const recipe = currentMix.recipe;

			if (!recipe.length || value <= 0) return recipe.map(() => 0);

			// Calculate current total weight
			const originalTotal = recipe.reduce((a, b) => a + b.amount, 0);
			if (originalTotal <= 0) return recipe.map(() => 0);

			// Calculate scaling factor based on method
			let scalingFactor = method === "multiply" ? value : 1 / value;

			// Check if scaling exceeds maxAllowedWeight
			let targetTotal = Math.floor(originalTotal * scalingFactor);
			if (targetTotal > maxAllowedWeight) {
				scalingFactor = maxAllowedWeight / originalTotal;
				targetTotal = Math.floor(originalTotal * scalingFactor);
			}

			// Step 1: Scale each ingredient proportionally
			const scaled = recipe.map((val) => {
				const raw = val.amount * scalingFactor;
				return { ...val, amount: Math.floor(raw) };
			});

			// Step 2: Handle rounding differences
			const currentTotal = scaled.reduce((a, b) => a + b.amount, 0);
			const diff = targetTotal - currentTotal;

			// Step 3: Distribute remainder to preserve ratios
			if (diff > 0) {
				const remainders = recipe.map((val, i) => ({
					index: i,
					remainder: val.amount * scalingFactor - scaled[i].amount,
				}));

				remainders.sort((a, b) => b.remainder - a.remainder);

				for (let i = 0; i < diff && i < remainders.length; i++) {
					const index = remainders[i].index;
					if (scaled.reduce((a, b) => a + b.amount, 0) < maxAllowedWeight) {
						scaled[index].amount++;
					}
				}
			}

			return isAuthed
				? user_currentMixSyncedState$.value.recipe.set(scaled)
				: local_currentMixSyncedState$.recipe.set(scaled);
		},
		setRecipeImage: (imageURL) => {
			return isAuthed
				? user_currentMixSyncedState$.value.image.set(imageURL)
				: local_currentMixSyncedState$.image.set(imageURL);
		},
		setMaxAllowedWeight: (weight) => {
			return isAuthed
				? user_currentMixSyncedState$.value.maxAllowedWeight.set(weight)
				: local_currentMixSyncedState$.maxAllowedWeight.set(weight);
		},
		setRecipeName: (name) => {
			return isAuthed
				? user_currentMixSyncedState$.value.name.set(name)
				: local_currentMixSyncedState$.name.set(name);
		},
		setRecipeDescription: (description) => {
			return isAuthed
				? user_currentMixSyncedState$.value.description.set(description)
				: local_currentMixSyncedState$.description.set(description);
		},
		setRecipeInformation: (information) => {
			return isAuthed
				? user_currentMixSyncedState$.value.information.set(information)
				: local_currentMixSyncedState$.information.set(information);
		},
		setRecipeCategory: (category) => {
			return isAuthed
				? user_currentMixSyncedState$.value.category.set(category)
				: local_currentMixSyncedState$.category.set(category);
		},
		setRecipeSellPrice: (price) => {
			return isAuthed
				? user_currentMixSyncedState$.value.sellPrice.set(price)
				: local_currentMixSyncedState$.sellPrice.set(price);
		},
		recipeAdd: (ingredientId) => {
			const recipe = currentMix.recipe;
			const sellPrice = currentMix.sellPrice;

			const found = recipe.find((ingredient) => ingredient.key === ingredientId);
			if (recipe.length === 0 && sellPrice === 0) {
				const sellPrices = allSellPrices$[ingredientId];
				if (sellPrices) {
					isAuthed
						? user_currentMixSyncedState$.value.sellPrice.set(sellPrices.min_price)
						: local_currentMixSyncedState$.sellPrice.set(sellPrices.min_price);
				}
			}
			if (found) {
				return toast({
					description: "Not Allowed to have two of the same ingredient.",
					title: "Warning",
					variant: "filled-warning",
				});
			}
			const itemToAdd = {
				key: ingredientId,
				amount: 1,
				child_ingredient_id: ingredientId,
				selected_purchase_option_id: null,
				totalPrice: 0,
			};
			return isAuthed
				? user_currentMixSyncedState$.value.recipe.push(itemToAdd)
				: local_currentMixSyncedState$.recipe.push(itemToAdd);
		},
		recipeRemove: (ingredientId) => {
			const filtered = currentMix.recipe.filter(
				(item) => item.child_ingredient_id !== ingredientId,
			);

			return isAuthed
				? user_currentMixSyncedState$.value.recipe.set([...filtered])
				: local_currentMixSyncedState$.recipe.set([...filtered]);
		},
		setRecipeOrderIndex: (ingredientId: string, newIndex: number) => {
			const recipe = currentMix.recipe; // Get plain array
			const currentIndex = recipe.findIndex((i) => i.child_ingredient_id === ingredientId);
			if (currentIndex === -1 || newIndex < 0 || newIndex >= recipe.length) return;

			const newRecipe = [...recipe]; // Create a new array
			const [item] = newRecipe.splice(currentIndex, 1); // Remove item
			newRecipe.splice(newIndex, 0, item); // Insert at new index

			return isAuthed
				? user_currentMixSyncedState$.value.recipe.set(newRecipe)
				: local_currentMixSyncedState$.recipe.set(newRecipe);
		},
		setRecipeMainIngredient: (ingredientId: string) => {
			const recipe = currentMix.recipe;
			const index = recipe.findIndex((i) => i.child_ingredient_id === ingredientId);
			if (index === -1) return;

			const newRecipe = [recipe[index], ...recipe.slice(0, index), ...recipe.slice(index + 1)];

			return isAuthed
				? user_currentMixSyncedState$.value.recipe.set(newRecipe)
				: local_currentMixSyncedState$.recipe.set(newRecipe);
		},
		moveUpRecipeIngredient: (ingredientId: string) => {
			const recipe = currentMix.recipe;
			const index = recipe.findIndex((i) => i.child_ingredient_id === ingredientId);
			if (index <= 0) return; // Already at the top or not found

			const newRecipe = [...recipe];
			[newRecipe[index - 1], newRecipe[index]] = [newRecipe[index], newRecipe[index - 1]];

			return isAuthed
				? user_currentMixSyncedState$.value.recipe.set(newRecipe)
				: local_currentMixSyncedState$.recipe.set(newRecipe);
		},
		moveDownRecipeIngredient: (ingredientId: string) => {
			const recipe = currentMix.recipe;
			const index = recipe.findIndex((i) => i.child_ingredient_id === ingredientId);
			if (index === -1 || index >= recipe.length - 1) return; // Not found or already at the bottom

			const newRecipe = [...recipe];
			[newRecipe[index], newRecipe[index + 1]] = [newRecipe[index + 1], newRecipe[index]];

			return isAuthed
				? user_currentMixSyncedState$.value.recipe.set(newRecipe)
				: local_currentMixSyncedState$.recipe.set(newRecipe);
		},
		swapRecipeIngredient: (ingredientId1: string, ingredientId2: string) => {
			const recipe = currentMix.recipe;
			const index1 = recipe.findIndex((i) => i.child_ingredient_id === ingredientId1);
			const index2 = recipe.findIndex((i) => i.child_ingredient_id === ingredientId2);
			if (index1 === -1 || index2 === -1) return;

			const newRecipe = [...recipe];
			[newRecipe[index1], newRecipe[index2]] = [newRecipe[index2], newRecipe[index1]];

			return isAuthed
				? user_currentMixSyncedState$.value.recipe.set(newRecipe)
				: local_currentMixSyncedState$.recipe.set(newRecipe);
		},
		setRecipeIngredientAmount: (ingredientId: string, amount: number) => {
			const maxAllowedWeight = currentMix.maxAllowedWeight;
			const recipe = currentMix.recipe;

			const safeAmount =
				Number.isNaN(amount) || typeof amount !== "number" || amount < 1 ? 1 : amount;

			const index = currentMix.recipe.findIndex(
				(recipe) => recipe.child_ingredient_id === ingredientId,
			);
			if (index === -1) return;

			// Calculate new total weight if this amount were set
			let newTotalWeight = 0;
			for (let i = 0; i < recipe.length; i++) {
				if (i === index) {
					newTotalWeight += safeAmount;
				} else {
					newTotalWeight += recipe[i].amount;
				}
			}

			if (newTotalWeight > maxAllowedWeight) {
				toast({
					title: "Weight Limit Exceeded",
					description: `Total weight ${newTotalWeight} exceeds max allowed weight of ${maxAllowedWeight}`,
					variant: "filled-warning",
				});
				return;
			}

			return isAuthed
				? user_currentMixSyncedState$.value.recipe[index].amount.set(safeAmount)
				: local_currentMixSyncedState$.recipe[index].amount.set(safeAmount);
		},
		setRecipeIngredientPurchaseOption: (ingredientId: string, purchaseOptionId: string) => {
			const index = currentMix.recipe.findIndex(
				(recipe) => recipe.child_ingredient_id === ingredientId,
			);

			return isAuthed
				? user_currentMixSyncedState$.value.recipe[index].selected_purchase_option_id.set(
						purchaseOptionId,
					)
				: local_currentMixSyncedState$.recipe[index].selected_purchase_option_id.set(
						purchaseOptionId,
					);
		},
		clearRecipe: () => {
			return isAuthed
				? user_currentMixSyncedState$.value.recipe.set([])
				: local_currentMixSyncedState$.recipe.set([]);
		},

		getIngredientPurity: (ingredientWeight, totalWeight) =>
			getMixPurity(ingredientWeight, totalWeight),

		setISGangMix: (isGangMix) => {
			return isAuthed
				? user_currentMixSyncedState$.value.gang.isGangOrder.set(isGangMix)
				: local_currentMixSyncedState$.gang.isGangOrder.set(isGangMix);
		},
		resetMix: async () => {
			if (isAuthed) {
				user_currentMixSyncedState$.value.assign({
					category: "Mix",
					description: "",
					image: "",
					information: "",
					name: "",
					sellPrice: 0,
					recipe: [],
				});
				return;
			}
			local_currentMixSyncedState$.assign({
				category: "Mix",
				description: "",
				image: "",
				information: "",
				name: "",
				sellPrice: 0,
				recipe: [],
			});
		},
		loadMixFromShareink: (data) => {
			const mix = data as ICurrentMix;
			synced$.assign({ ...mix });
		},
	};

	return {
		actions,
		state: {
			currentMixData: {
				...currentMix,
				...computedState,
				gangData: computedGangStats,
				miscData: { ...computedClientAddicted, ...computedClientODData, ...toxComputedData },
			},
			...mixManagerErrorState,
		},
	};
};

function observeRecipeItemTotalPrice() {
	useObserve(() => {
		const isAuthed = authState$.isAuthed.get();
		const recipe = synced$.recipe.get();
		for (const [index, r] of recipe.entries()) {
			if (!r.selected_purchase_option_id) {
				return;
			}
			const purchase = allPurchases$[r.selected_purchase_option_id].get();
			if (!purchase) {
				return;
			}
			if (isAuthed) {
				user_currentMixSyncedState$.value.recipe[index].totalPrice?.set(
					Number.parseFloat((purchase.price * r.amount).toFixed(2)),
				);
			} else {
				local_currentMixSyncedState$.recipe[index].totalPrice?.set(
					Number.parseFloat((purchase.price * r.amount).toFixed(2)),
				);
			}
		}
	});
}

function observeCheckForAcetone() {
	useObserve(() => {
		const isAuthed = authState$.isAuthed.get();
		const recipe = synced$.recipe.get();

		let foundLiquid = false;
		let id = "";

		for (const item of recipe) {
			const childId = item.child_ingredient_id; // Ensure reactivity
			const ing = allIngredients$[childId].get();

			if (isIngredient(ing)) {
				if (ing?.type === "Liquid") {
					foundLiquid = true;
					id = ing.id;
					break;
				}
			} else {
				const ingParent = allIngredients$[ing.parent_ingredient_id].get();

				if (isIngredient(ingParent) && ingParent?.type === "Liquid") {
					foundLiquid = true;
					id = ing.id;
					break;
				}
			}
		}

		const targetState$ = isAuthed
			? user_currentMixSyncedState$.value
			: local_currentMixSyncedState$;

		// Force tracking of relevant observables
		const targetItem = targetState$.recipe.find((item) => item.child_ingredient_id.get() === id);

		if (targetItem) {
			const currentAmount = targetItem.amount.get(); // Force tracking
			if (currentAmount !== 1) {
				targetItem.amount.set(1);
			}
		}

		const max = foundLiquid ? 400 : 1000;
		if (targetState$.maxAllowedWeight.get() !== max) {
			targetState$.maxAllowedWeight.set(max);
		}
	});
}

function getMixTotalWeight(recipe: IIngredientRecipe[]) {
	return recipe.reduce((sum, item) => sum + item?.amount, 0);
}

function getMixPurity(ingredientWeight: number, totalWeight: number) {
	return Number.parseFloat(((ingredientWeight / totalWeight) * 100).toFixed(2));
}

function getMixStrengthMultiplier(recipe: IIngredientRecipe[], totalMixWeight: number) {
	return Number.parseFloat(
		(
			recipe.reduce((sum, comp) => {
				const ingredient = allIngredients$[comp.child_ingredient_id].get();
				return sum + (ingredient?.mix_strengthening || 0) * comp.amount;
			}, 0) / totalMixWeight
		).toFixed(2),
	);
}

function calculateProperty(
	property: "toxicity" | "strength" | "addictiveness",
	recipe: IIngredientRecipe[],
	mixStrengthMultiplier: number,
	totalMixWeight: number,
) {
	return Number.parseFloat(
		(
			(mixStrengthMultiplier / totalMixWeight) *
			recipe.reduce((sum, comp) => {
				const ingredient = allIngredients$[comp.child_ingredient_id].get();
				return (
					sum + ((ingredient?.[property] || 0) / (ingredient?.mix_strengthening || 1)) * comp.amount
				);
			}, 0)
		).toFixed(2),
	);
}

function observeCheckForErrors() {
	useObserve(() => {
		mixManagerErrorState$.errors.name.set(
			validateField(z.string().min(3, "Name must be longer"), synced$.name.get()).errors,
		);
		mixManagerErrorState$.errors.recipe.set(
			validateField(
				z.array(z.object({})).min(2, "Recipe must have at least two ingredients"),
				synced$.recipe.get(),
			).errors,
		);
	});
}

function observeCheckForCanSave() {
	useObserve(() => {
		const currentErrors = mixManagerErrorState$.errors.get(); // Determine if all error fields are null or empty
		const hasErrors = currentErrors
			? Object.values(currentErrors).some((error) => error !== null && error.length > 0)
			: false;

		mixManagerErrorState$.canSave.set(!hasErrors);
	});
}
