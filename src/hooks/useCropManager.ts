import { user_cropPlnnerState$ } from "@/lib/state/cloud/userCropPlanner";
import { authState$ } from "@/lib/state/local/authState";
import { local_cropPlannerSyncedState$ } from "@/lib/state/local/localCropPlanner";
import { computed, observable } from "@legendapp/state";
import { use$, useObserve } from "@legendapp/state/react";
import SeedData from "../lib/data/seed_data.json";

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

interface IComputed {
	seedCost: number;
	cropCost: number;
	timesNeedsWatering: number;
	selectedSeed: ISeedData;
	setup: {
		totalCost: number;
		filters: { each: number; required: number; tCost: number };
		pots: { each: number; required: number; tCost: number };
		dryers: { each: number; required: number; tCost: number };
		lights: { each: number; required: number; tCost: number };
	};
}

export interface ISynced {
	cropSize: number;
	sellPrice: number;
	selectedSeedIndex: number;
	setup: {
		include: boolean;
		filters: { have: number };
		pots: { have: number };
		dryers: { have: number };
		lights: { have: number };
	};
}

type TUseCropManagerState = IComputed &
	ISynced & {
		seeds: ISeedData[];
	};

interface IUseCropManagerActions {
	updateSellPrice: (price: number) => void;
	setSelectedSeedIndex: (index: number) => void;
	updateCropSize: (size: number) => void;
	toggleIncludeSetup: () => void;
	setIncludeSetup: (include: boolean) => void;
	updateAlreadyOwnedItems: (item: "dryers" | "lights" | "filters" | "pots", owned: number) => void;
}
interface IUseCropManager extends IUseCropManagerActions, TUseCropManagerState {}

const computedState$ = observable<IComputed>({
	cropCost: 0,
	seedCost: 0,
	timesNeedsWatering: 0,
	selectedSeed: {
		strain: "ak-420",
		grams: 0,
		hours: 0,
		wetAmount: 0,
		dryRate: 0,
		strainYield: 0,
		price: 0,
		environment: "outdoor",
		waterPerHour: 0,
	},
	setup: {
		totalCost: 0,
		dryers: { each: 450, required: 0, tCost: 0 },
		lights: { each: 150, required: 0, tCost: 0 },
		filters: { each: 300, required: 0, tCost: 0 },
		pots: { each: 40, required: 0, tCost: 0 },
	},
});

const synced$ = computed(() => {
	return authState$.isAuthed.get()
		? user_cropPlnnerState$.value.get()
		: local_cropPlannerSyncedState$.get();
});

const cropPlannerState$ = computed(() => {
	const synced = synced$.get();
	const computedVals = computedState$.get();
	return {
		sellPrice: synced.sellPrice,
		selectedSeedIndex: synced.selectedSeedIndex,
		selectedSeed: computedState$.selectedSeed.get(),
		cropSize: synced.cropSize,
		cropCost: computedVals.cropCost,
		seedCost: computedVals.seedCost,
		timesNeedsWatering: computedVals.timesNeedsWatering,
		setup: {
			totalCost: computedVals.setup.totalCost,
			include: synced.setup.include,
			dryers: {
				have: synced.setup.dryers.have,
				each: computedVals.setup.dryers.each,
				required: computedVals.setup.dryers.required,
				tCost: computedVals.setup.dryers.tCost,
			},
			lights: {
				have: synced.setup.lights.have,
				each: computedVals.setup.lights.each,
				required: computedVals.setup.lights.required,
				tCost: computedVals.setup.lights.tCost,
			},
			filters: {
				have: synced.setup.filters.have,
				each: computedVals.setup.filters.each,
				required: computedVals.setup.filters.required,
				tCost: computedVals.setup.filters.tCost,
			},
			pots: {
				have: synced.setup.pots.have,
				each: computedVals.setup.pots.each,
				required: computedVals.setup.pots.required,
				tCost: computedVals.setup.pots.tCost,
			},
		},
	};
});

export const useCropManager = (): IUseCropManager => {
	const seeds: ISeedData[] = SeedData.map((data) => ({
		...data,
		strain: data.strain as TStrain,
		wetAmount: data.wet_amount,
		dryRate: data.dry_rate,
		strainYield: data.strain_yield,
		environment: data.in_or_out as TGrowEnvironment,
		waterPerHour: data.water_per_hour,
	})).sort((a, b) => {
		if (a.environment !== b.environment) {
			return a.environment === "outdoor" ? -1 : 1;
		}

		return a.price - b.price;
	});
	observeSelectedSeed(seeds);
	observeCropCost();
	observeTimesNeedsWatering();
	observeSeedCost();
	observeTotalCost();
	observeSetupItem("dryers");
	observeSetupItem("filters");
	observeSetupItem("pots");
	observeSetupItem("lights");

	const mergedState = use$(cropPlannerState$);

	const actions: IUseCropManagerActions = {
		updateSellPrice: (price) => {
			if (authState$.isAuthed.get()) {
				user_cropPlnnerState$.value.sellPrice.set(price);
			} else {
				local_cropPlannerSyncedState$.sellPrice.set(price);
			}
		},

		setSelectedSeedIndex: (index) => {
			if (authState$.isAuthed.get()) {
				user_cropPlnnerState$.value.selectedSeedIndex.set(index);
			} else {
				local_cropPlannerSyncedState$.selectedSeedIndex.set(index);
			}
		},

		updateCropSize: (size) => {
			if (authState$.isAuthed.get()) {
				user_cropPlnnerState$.value.cropSize.set(size);
			} else {
				local_cropPlannerSyncedState$.cropSize.set(size);
			}
		},

		toggleIncludeSetup: () => {
			if (authState$.isAuthed.get()) {
				user_cropPlnnerState$.value.setup.include.toggle();
			} else {
				local_cropPlannerSyncedState$.setup.include.toggle();
			}
		},

		setIncludeSetup: (include) => {
			if (authState$.isAuthed.get()) {
				user_cropPlnnerState$.value.setup.include.set(include);
			} else {
				local_cropPlannerSyncedState$.setup.include.set(include);
			}
		},

		updateAlreadyOwnedItems: (item, owned) => {
			if (authState$.isAuthed.get()) {
				user_cropPlnnerState$.value.setup[item].have.set(owned);
			} else {
				local_cropPlannerSyncedState$.setup[item].have.set(owned);
			}
		},
	};

	return {
		...actions,
		...mergedState,
		seeds,
	};
};

function calculateRequired(name: "pots" | "lights" | "dryers" | "filters") {
	const selected = cropPlannerState$.selectedSeed.get();
	const size = cropPlannerState$.cropSize.get();
	let required = 0;
	if (name === "dryers") {
		required = Math.floor((selected.grams * size) / 1000);
	} else if (name === "filters") {
		required = Math.ceil(size / 3.5);
	} else if (name === "lights") {
		required = Math.ceil(size / 8);
	} else if (name === "pots") {
		required = size;
	}

	return required;
}

function observeSetupItem(name: "pots" | "lights" | "dryers" | "filters") {
	useObserve(() => {
		const price = cropPlannerState$.setup[name].each.get();
		const owned = cropPlannerState$.setup[name].have.get();
		const required = calculateRequired(name);
		const tCost = price * (required - owned);

		computedState$.setup[name].assign({
			required,
			tCost,
		});
	});
}

function observeTimesNeedsWatering() {
	useObserve(() => {
		const selected = cropPlannerState$.selectedSeed.get();

		const timesNeedsWatering = Math.ceil(selected.hours / selected.waterPerHour);
		computedState$.timesNeedsWatering.set(timesNeedsWatering);
	});
}

function observeSeedCost() {
	useObserve(() => {
		const size = cropPlannerState$.cropSize.get();
		const selected = cropPlannerState$.selectedSeed.get();
		const seedCost = selected.price * size;
		computedState$.seedCost.set(seedCost);
	});
}

function observeTotalCost() {
	useObserve(() => {
		const includeSetup = cropPlannerState$.setup.include.get();
		const potsTotal = cropPlannerState$.setup.pots.tCost.get();
		const lightsTotal = cropPlannerState$.setup.lights.tCost.get();
		const filtersTotal = cropPlannerState$.setup.filters.tCost.get();
		const dryersTotal = cropPlannerState$.setup.dryers.tCost.get();

		const totalCost = includeSetup ? potsTotal + lightsTotal + filtersTotal + dryersTotal : 0;

		computedState$.setup.totalCost.set(totalCost);
	});
}
function observeCropCost() {
	useObserve(() => {
		const setupCost = cropPlannerState$.setup.totalCost.get();
		const size = cropPlannerState$.cropSize.get();
		const selected = cropPlannerState$.selectedSeed.get();
		const cropCost = setupCost + selected.price * size;
		computedState$.cropCost.set(cropCost);
	});
}

function observeSelectedSeed(seeds: ISeedData[]) {
	useObserve(() => {
		const selectedIndex = cropPlannerState$.selectedSeedIndex.get();
		const selected = seeds[selectedIndex];

		computedState$.selectedSeed.set(selected);
	});
}
