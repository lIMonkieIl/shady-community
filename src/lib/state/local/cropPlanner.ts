import { type Observable, observable } from "@legendapp/state";
import SeedData from "../../data/seed_data.json";

export const strains = {
	GhettoKush: "ghetto kush",
	BongBreaker: "bong breaker",
	FireCracker: "firecracker",
	StonerHaze: "stoner haze",
	AK420: "ak-420",
	Brainfuck: "brainfuck",
	DubaiSativa: "dubai sativa",
	Skyscrapper: "skyscrapper",
} as const;

export const growEnvironments = {
	Indoor: "indoor",
	Outdoor: "outdoor",
} as const;

export type TGrowEnvironment = (typeof growEnvironments)[keyof typeof growEnvironments];

export type TStrain = (typeof strains)[keyof typeof strains];

export interface ISeedData {
	strain: TStrain;
	grams: number;
	hours: number;
	wetAmount: number;
	dryRate: number;
	strainYield: number;
	price: number;
	environment: TGrowEnvironment;
	waterPerHour: number;
}

export interface ICropPlannerState {
	input: Observable<{
		sellPrice: number;
		selectedSeedIndex: number;
		cropSize: number;
		setup: {
			include: boolean;
			filters: { have: number };
			pots: { have: number };
			dryers: { have: number };
			lights: { have: number };
		};
	}>;
	seeds: ISeedData[];
	computed: {
		cropCost: number;
		seedCost: number;
		timesNeedsWatering: number;
		setup: {
			totalCost: number;
			filters: { each: number; required: number; tCost: number };
			pots: { each: number; required: number; tCost: number };
			dryers: { each: number; required: number; tCost: number };
			lights: { each: number; required: number; tCost: number };
		};
	};
}

export const cropPlannerState$ = observable<ICropPlannerState>({
	seeds: SeedData.map((data) => ({
		...data,
		strain: data.strain as TStrain,
		wetAmount: data.wet_amount,
		dryRate: data.dry_rate,
		strainYield: data.strain_yield,
		environment: data.in_or_out as TGrowEnvironment,
		waterPerHour: data.water_per_hour,
	})).sort((a, b) => {
		// First, sort by environment: 'indoor' before 'outdoor'
		if (a.environment !== b.environment) {
			return a.environment === "outdoor" ? -1 : 1;
		}

		// Then, sort by price (assuming price is a number)
		return a.price - b.price;
	}),
	input: observable({
		sellPrice: 10,
		selectedSeedIndex: 0,
		cropSize: 1,
		setup: {
			include: false,
			pots: { have: 0 },
			lights: { have: 0 },
			filters: { have: 0 },
			dryers: { have: 0 },
		},
	}),
	computed: {
		cropCost: observable((): number => {
			const setupCost = cropPlannerState$.computed.setup.totalCost;
			const size = cropPlannerState$.input.cropSize;
			const selectedIndex = cropPlannerState$.input.selectedSeedIndex;
			const selected = cropPlannerState$.seeds[selectedIndex.get()];
			return setupCost.get() + selected.price.get() * size.get();
		}),
		seedCost: observable((): number => {
			const size = cropPlannerState$.input.cropSize;
			const selectedIndex = cropPlannerState$.input.selectedSeedIndex;
			const selected = cropPlannerState$.seeds[selectedIndex.get()];

			return selected.price.get() * size.get();
		}),
		timesNeedsWatering: observable((): number => {
			const selectedIndex = cropPlannerState$.input.selectedSeedIndex;
			const selected = cropPlannerState$.seeds[selectedIndex.get()];
			return Math.ceil(selected.hours.get() / selected.waterPerHour.get());
		}),

		setup: {
			totalCost: observable((): number => {
				const includeSetup = cropPlannerState$.input.setup.include;
				const potsTotal = cropPlannerState$.computed.setup.pots.tCost;
				const lightsTotal = cropPlannerState$.computed.setup.lights.tCost;
				const filtersTotal = cropPlannerState$.computed.setup.filters.tCost;
				const dryersTotal = cropPlannerState$.computed.setup.dryers.tCost;

				return includeSetup.get()
					? potsTotal.get() + lightsTotal.get() + filtersTotal.get() + dryersTotal.get()
					: 0;
			}),
			pots: {
				each: 40,
				required: observable((): number => {
					return Math.ceil(cropPlannerState$.input.cropSize.get());
				}),
				tCost: observable((): number => {
					const required = cropPlannerState$.computed.setup.pots.required;
					const cost = cropPlannerState$.computed.setup.pots.each;
					const owned = cropPlannerState$.input.setup.pots.have;
					return cost.get() * (required.get() - owned.get());
				}),
			},
			lights: {
				each: 150,
				required: observable((): number => {
					const size = cropPlannerState$.input.cropSize.get();
					return Math.ceil(Math.ceil(size / 8));
				}),
				tCost: observable((): number => {
					const required = cropPlannerState$.computed.setup.lights.required;
					const cost = cropPlannerState$.computed.setup.lights.each;
					const owned = cropPlannerState$.input.setup.lights.have;
					return cost.get() * (required.get() - owned.get());
				}),
			},
			filters: {
				each: 300,
				required: observable((): number => {
					const size = cropPlannerState$.input.cropSize.get();
					return Math.ceil(Math.ceil(size / 3.5));
				}),
				tCost: observable((): number => {
					const required = cropPlannerState$.computed.setup.filters.required;
					const cost = cropPlannerState$.computed.setup.filters.each;
					const owned = cropPlannerState$.input.setup.filters.have;
					return cost.get() * (required.get() - owned.get());
				}),
			},
			dryers: {
				each: 450,
				required: observable((): number => {
					const size = cropPlannerState$.input.cropSize;
					const selectedIndex = cropPlannerState$.input.selectedSeedIndex;
					const selected = cropPlannerState$.seeds[selectedIndex.get()];
					return Math.floor((selected.grams.get() * size.get()) / 1000);
				}),
				tCost: observable((): number => {
					const required = cropPlannerState$.computed.setup.dryers.required;
					const cost = cropPlannerState$.computed.setup.dryers.each;
					const owned = cropPlannerState$.input.setup.dryers.have;
					return cost.get() * (required.get() - owned.get());
				}),
			},
		},
	},
});
