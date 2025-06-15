import { createClient } from "@/lib/supabase/client";
import { observable } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { v4 as uuidv4 } from "uuid";
import { authState$ } from "../local/authState";

const supabase = createClient();
const generateId = () => uuidv4();

export const user_cropPlnnerState$ = observable(
	syncedSupabase({
		supabase,
		as: "value",
		collection: "user_preferences",
		initial: {
			preference_type: "crop_planner",
			value: {
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
		},
		persist: {
			name: "user_crop_planner",
			plugin: ObservablePersistLocalStorage,
			retrySync: true,
		},
		realtime: {
			filter: "preference_type=eq.crop_planner",
		},
		fieldCreatedAt: "created_at",
		fieldUpdatedAt: "updated_at",
		select: (from) =>
			from
				.select("*")
				.eq("user_id", authState$.user.id.get() ?? "")
				.eq("preference_type", "crop_planner")
				.limit(1),
		filter: (select) =>
			select
				.eq("user_id", authState$.user.id.get() ?? "")
				.eq("preference_type", "crop_planner")
				.limit(1),
		waitFor: authState$.isAuthed,
		waitForSet: authState$.isAuthed,
		generateId,
	}),
);
