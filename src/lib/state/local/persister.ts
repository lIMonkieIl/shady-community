import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { configureSynced } from "@legendapp/state/sync";

// Configure the base `synced`
export const localPersist = configureSynced({
	persist: {
		plugin: ObservablePersistLocalStorage,
		retrySync: true,
	},
});
