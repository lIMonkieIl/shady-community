import { syncState } from "@legendapp/state";
import { user_cropPlnnerState$ } from "./cloud/userCropPlanner";
import { user_currentMixSyncedState$ } from "./cloud/userCurrentMixSyncedState";
import { user_MixesRecipes$ } from "./cloud/userMixesRecipes";
import { user_mixes$ } from "./cloud/userMixesState";
import { user_themePreferencesState$ } from "./cloud/userThemePreferences";

export async function clearCloudStore() {
	const stores = [
		user_themePreferencesState$,
		user_cropPlnnerState$,
		user_currentMixSyncedState$,
		user_mixes$,
		user_MixesRecipes$,
	];
	for (const store of stores) {
		const state = syncState(store);
		await state.reset();
	}
}
