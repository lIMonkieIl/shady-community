export type TItemCategory = "Additive" | "Drug" | "Filler";

export type TItemType =
	| "Liquid"
	| "Powder"
	| "Crystal"
	| "Pills"
	| "Granulate"
	| "Dried Plant"
	| "Mushrooms";

export type TItemDemandSector = "A" | "B" | "C";

export type TItemDemandName =
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

export type TItemPurchaseOptionFrom =
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

export interface IItem {
	id: string;
	name: string;
	category: TItemCategory;
	type: TItemType;
	image: string;
	description: string;
	information: string;
	toxicity: number;
	strength: number;
	addictiveness: number;
	mix_strengthening: number;
	purchase: IItemPurchaseOption[];
	sell: IItemSellPrice;
	demand: IItemDemand[];
}

export interface IItemPurchaseOption {
	from: TItemPurchaseOptionFrom;
	price: number;
}

export interface IItemSellPrice {
	min: number;
	max: number;
}

export interface IItemDemand {
	sector: TItemDemandSector;
	name: TItemDemandName;
	value: number;
}
