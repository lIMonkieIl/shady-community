import { createClient } from "@/lib/supabase/client";
import { observable } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { v4 as uuidv4 } from "uuid";
import { authState$ } from "../local/authState";

const supabase = createClient();
const generateId = () => uuidv4();
export const user_mixes$ = observable(
	syncedSupabase({
		supabase,
		collection: "mixes",
		persist: {
			name: "user_mixes",
			plugin: ObservablePersistLocalStorage,
			retrySync: true,
		},
		filter: (select) => select.eq("created_by", authState$.user.id.get() ?? ""),
		realtime: {
			filter: `created_by=eq.${authState$.user.id.get()}`,
		},
		generateId,
		fieldCreatedAt: "created_at",
		fieldUpdatedAt: "updated_at",
		waitFor: authState$.isAuthed,
		waitForSet: authState$.isAuthed,
		retry: { infinite: true },
	}),
);
