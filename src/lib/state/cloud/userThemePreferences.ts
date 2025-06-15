import { createClient } from "@/lib/supabase/client";
import { observable } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { v4 as uuidv4 } from "uuid";
import { authState$ } from "../local/authState";

const supabase = createClient();
const generateId = () => uuidv4();

export const user_themePreferencesState$ = observable(
	syncedSupabase({
		supabase,
		as: "value",
		collection: "user_preferences",
		initial: {
			preference_type: "theme",
			value: {
				name: "DDS",
				mode: "system",
				decoration: "none",
			},
		},
		persist: {
			name: "user_theme_preferences",
			plugin: ObservablePersistLocalStorage,
			retrySync: true,
		},
		realtime: {
			filter: "preference_type=eq.theme",
		},
		fieldCreatedAt: "created_at",
		fieldUpdatedAt: "updated_at",
		select: (from) =>
			from
				.select("*")
				.eq("user_id", authState$.user.id.get() ?? "")
				.eq("preference_type", "theme")
				.limit(1),
		filter: (select) =>
			select
				.eq("user_id", authState$.user.id.get() ?? "")
				.eq("preference_type", "theme")
				.limit(1),
		waitFor: authState$.isAuthed,
		waitForSet: authState$.isAuthed,
		generateId,
	}),
);
