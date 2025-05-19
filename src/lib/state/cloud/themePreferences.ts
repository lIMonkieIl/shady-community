import { createClient } from "@/lib/supabase/client";
import { observable } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { v4 as uuidv4 } from "uuid";
import { authState$ } from "../local/authState";
const generateId = () => uuidv4();

const supabase = createClient();
export const themePreferencesState$ = observable(
	syncedSupabase({
		initial: {
			preference_type: "theme",
			value: { name: "DDS", mode: "system", decoration: "none" },
		},
		changesSince: "last-sync",
		mode: "assign",
		debounceSet: 5000,
		supabase,
		as: "value",
		collection: "user_preferences",
		// Filter by user_id and preference_type
		filter: (select) =>
			select.eq("user_id", authState$.user.id.get() ?? "").eq("preference_type", "theme"),
		// Persist locally for offline support
		persist: {
			name: "theme-preferences",
			plugin: ObservablePersistLocalStorage,
			retrySync: true,
		},
		generateId,
		// select: (from) =>
		// 	from.select("value, preference_type").eq("user_id", authState$.user.id.get() ?? ""),
		// Enable realtime updates
		realtime: { schema: "public", filter: `user_id=eq.${authState$.user.id.get()}` },
		// Add fields needed for change tracking
		fieldCreatedAt: "created_at",
		fieldUpdatedAt: "updated_at",
		retry: { infinite: true },
		waitFor: authState$.isAuthed,
	}),
);
