import { createClient } from "@/lib/supabase/client";
import type { IDatabaseCurMix } from "@/lib/types/database.types";
import { observable } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { v4 as uuidv4 } from "uuid";
import { authState$ } from "../local/authState";
import { initialMix } from "../local/localCurrentMixSyncedState";

const supabase = createClient();
const generateId = () => uuidv4();

export const user_currentMixSyncedState$ = observable<IDatabaseCurMix>(
	syncedSupabase({
		supabase,
		as: "value",
		collection: "user_preferences",
		initial: {
			preference_type: "cur_mix",
			value: initialMix,
		},
		persist: {
			name: "user_cur_mix",
			plugin: ObservablePersistLocalStorage,
			retrySync: true,
		},
		realtime: {
			filter: "preference_type=eq.cur_mix",
		},
		fieldCreatedAt: "created_at",
		fieldUpdatedAt: "updated_at",
		select: (from) =>
			from
				.select("*")
				.eq("user_id", authState$.user.id.get() ?? "")
				.eq("preference_type", "cur_mix")
				.limit(1),
		filter: (select) =>
			select
				.eq("user_id", authState$.user.id.get() ?? "")
				.eq("preference_type", "cur_mix")
				.limit(1),
		waitFor: authState$.isAuthed,
		waitForSet: authState$.isAuthed,
		generateId,
	}),
);
