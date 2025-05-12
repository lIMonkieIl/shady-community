import type { IItem, IItemPurchaseOption } from "../types/item";
import type { IMix, IMixComponent, IMixProperties } from "../types/mix";
import type { IQualitativeRange, TQualitativeValue } from "../types/qualityValue";

export function getQualitativeValue(
	table: IQualitativeRange[],
	value: number,
): TQualitativeValue | "Unknown" {
	const range = table.find((range) => value >= range.min && value <= range.max);
	return range ? range.qualitative : "Unknown";
}

export function getPurchaseOptions(
	ingredients: IItem[] | IMix[],
	ingredientId: string,
): IItemPurchaseOption[] {
	const ingredient = ingredients.find((i) => i.id === ingredientId);
	return (ingredient?.purchase || []) as IItemPurchaseOption[];
}

export function getLowestPrice(
	ingredients: IItem[] | IMix[],
	ingredientId: string,
): IItemPurchaseOption | null {
	const options = getPurchaseOptions(ingredients, ingredientId);
	if (options.length === 0) return null;
	return options.reduce((lowest, current) => (current.price < lowest.price ? current : lowest));
}

export function getMixStrengthMultiplier(
	mix: IMix,
	ingredients: IItem[] | IMix[],
	totalVolume: number,
) {
	return (
		(mix.recipe as unknown as IMixComponent[]).reduce((sum, comp) => {
			const ingredient = ingredients.find((i) => i.id === comp.id);
			return sum + (ingredient?.mix_strengthening || 0) * comp.volume;
		}, 0) / totalVolume
	);
}

export function calculateProperty(
	property: "toxicity" | "strength" | "addictiveness",
	mix: IMix,
	ingredients: IItem[] | IMix[],
	mixStrengthMultiplier: number,
	totalVolume: number,
) {
	return (
		(mixStrengthMultiplier / totalVolume) *
		(mix.recipe as unknown as IMixComponent[]).reduce((sum, comp) => {
			const ingredient = ingredients.find((i) => i.id === comp.id);
			return (
				sum + ((ingredient?.[property] || 0) / (ingredient?.mix_strengthening || 1)) * comp.volume
			);
		}, 0)
	);
}

export function mixPurity(mainDrugVolume: number, totalVolume: number) {
	return (mainDrugVolume / totalVolume) * 100;
}

export function mixCost(mix: IMix, ingredients: IItem[] | IMix[]) {
	return (mix.recipe as unknown as IMixComponent[]).reduce((sum, comp) => {
		const purchaseOption = comp?.purchaseFrom
			? getPurchaseOptions(ingredients, comp.id).find((opt) => opt.from === comp.purchaseFrom)
			: getLowestPrice(ingredients, comp.id);
		return sum + (purchaseOption?.price || 0) * comp.volume;
	}, 0);
}

export function getMixTotalVolume(mix: IMix) {
	return (mix.recipe as unknown as IMixComponent[]).reduce((sum, comp) => sum + comp?.volume, 0);
}

export function getMixMainDrug(
	mix: IMix,
	ingredients: IItem[] | IMix[],
): ((IItem | IMix) & { volume: number }) | undefined {
	const mainDrug = (mix.recipe[0] as unknown as IMixComponent) ?? null;
	const drug = ingredients.find((i) => i.id === mainDrug.id);
	if (!drug) {
		return;
	}
	return { ...drug, volume: mainDrug.volume };
}

export function sellPrice(sellPricePerGram: number, totalMixVolume: number) {
	return sellPricePerGram * totalMixVolume;
}
export function mixAddedWeight(mainDrugVolume: number, totalMixVolume: number) {
	return totalMixVolume - mainDrugVolume;
}
export function profitFromCutting(sellPricePerGram: number, addedWeight: number) {
	return sellPricePerGram * addedWeight;
}

export function totalProfit(sellPricePerGram: number, mixCost: number) {
	return sellPricePerGram - mixCost;
}

export function profitFromMarkup(totalProfit: number, profitFromCutting: number) {
	return totalProfit - profitFromCutting;
}

export function calculateMixProperties(
	mix: IMix,
	sellPricePerGram: number,
	ingredients: IItem[] | IMix[],
): IMixProperties {
	const totalVolume = getMixTotalVolume(mix);

	if (totalVolume === 0) {
		return {
			addedWeight: 0,
			cost: 0,
			profit: 0,
			profitFromCutting: 0,
			profitFromMarkup: 0,
			purity: 0,
			sellPrice: 0,
			sellPricePerGram: 0,
			totalVolume: 0,
		};
	}

	const mainItem = getMixMainDrug(mix, ingredients);
	if (!mainItem) {
		throw new Error("Main ingredient not found");
	}
	const cost = mixCost(mix, ingredients);

	const addedWeight = mixAddedWeight(mainItem.volume, totalVolume);
	const profit = totalProfit(sellPricePerGram, cost);
	const cuttingProfit = profitFromCutting(sellPricePerGram, addedWeight);

	return {
		totalVolume,
		purity: Number(mixPurity(mainItem.volume, totalVolume).toFixed(2)),
		cost: Number(cost.toFixed(2)),
		profit: Number(profit.toFixed(2)),
		profitFromCutting: Number(cuttingProfit.toFixed(2)),
		profitFromMarkup: Number(profitFromMarkup(profit, cuttingProfit).toFixed(2)),
		sellPrice: Number(sellPrice(sellPricePerGram, totalVolume).toFixed(2)),
		sellPricePerGram: Number(sellPricePerGram.toFixed(2)),
		addedWeight,
	};
}
