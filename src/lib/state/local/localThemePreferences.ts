import type { ITheme } from "@/lib/types/app";
import { observable } from "@legendapp/state";
import { localPersist } from "./persister";

export const local_themePreferencesState$ = observable<ITheme>(
	localPersist({
		initial: {
			name: "DDS",
			mode: "system",
			decoration: "none",
		},
		persist: {
			name: "local_theme_preferences",
		},
	}),
);
