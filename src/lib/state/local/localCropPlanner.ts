import type { ISynced } from "@/hooks/useCropManager";
import { observable } from "@legendapp/state";
import { localPersist } from "./persister";

export const local_cropPlannerSyncedState$ = observable<ISynced>(
	localPersist({
		initial: {
			sellPrice: 10,
			selectedSeedIndex: 0,
			cropSize: 1,
			setup: {
				include: false,
				dryers: { have: 0 },
				lights: { have: 0 },
				filters: { have: 0 },
				pots: { have: 0 },
			},
		},
		persist: {
			name: "local_crop_planner",
		},
	}),
);
