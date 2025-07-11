import type { ICurrentMix } from "@/hooks/useMixManager";
import { observable } from "@legendapp/state";
import { localPersist } from "./persister";

export const initialMix: ICurrentMix = {
	name: "",
	description: null,
	information: null,
	image: "",
	category: "Mix",
	sellPrice: 0,
	maxAllowedWeight: 1000,
	expectedQuality: 80,
	gang: {
		gangOrder: 3,
		isGangOrder: false,
		gangXP: 500,
	},

	recipe: [],
};
export const local_currentMixSyncedState$ = observable<ICurrentMix>(
	localPersist({
		initial: initialMix,
		persist: {
			name: "local_cur_mix",
		},
	}),
);
