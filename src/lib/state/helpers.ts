import { syncState } from "@legendapp/state";
import { themePreferencesState$ } from "./cloud/themePreferences";

export async function clearCloudStore() {
	await clearThemePreferences();
}

async function clearThemePreferences() {
	if ("user_id" in themePreferencesState$.get()) {
		const state = syncState(themePreferencesState$);
		await state.reset();
		await state.resetPersistence();
		state.isSyncEnabled.set(false);
		state.isPersistEnabled.set(false);
	}
}
