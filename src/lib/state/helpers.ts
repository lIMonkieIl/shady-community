import { syncState } from "@legendapp/state";
import { user_cropPlnnerState$ } from "./cloud/userCropPlanner";
import { user_themePreferencesState$ } from "./cloud/userThemePreferences";

export async function clearCloudStore() {
	const stores = [user_themePreferencesState$, user_cropPlnnerState$];
	for (const store of stores) {
		if ("user_id" in store) {
			const state = syncState(store);
			await state.reset();
			await state.resetPersistence();
		}
	}
}
