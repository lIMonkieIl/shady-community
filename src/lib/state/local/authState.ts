import type { Tables } from "@/lib/types/supabase.types";
import { observable } from "@legendapp/state";
import type { Session, User } from "@supabase/supabase-js";

export interface AuthState {
	user: User | null;
	session: Session | null;
	profile: Tables<"profiles"> | null;
	isLoading: boolean;
	initialized: boolean;
	isAuthed: boolean;
}

export const authState$ = observable<AuthState>({
	initialized: false,
	isAuthed: (): boolean => {
		const user = authState$.user.get();
		const session = authState$.session.get();
		if (session && user) {
			return true;
		}
		return false;
	},
	isLoading: true,
	user: null,
	session: null,
	profile: null,
});
