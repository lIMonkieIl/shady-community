import type { Tables } from "@/lib/types/supabase.types";
import { observable, observe } from "@legendapp/state";
import type { Session, User } from "@supabase/supabase-js";

type TAuthState = {
	user: User | null;
	session: Session | null;
	profile: Tables<"profiles"> | null;
	isLoading: boolean;
	isAuthenticated: boolean;
};

export const authState$ = observable<TAuthState>({
	user: null,
	profile: null,
	session: null,
	isLoading: true,
	isAuthenticated: false,
});

observe(() => {
	authState$.isAuthenticated.set(!!authState$.user.get());
});
