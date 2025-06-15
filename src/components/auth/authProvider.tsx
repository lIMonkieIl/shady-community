"use client";
import { clearCloudStore } from "@/lib/state/helpers";
import { authState$ } from "@/lib/state/local/authState";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/types/supabase.types";
import { observer, useObserveEffect } from "@legendapp/state/react";
import { createContext, useContext } from "react";

type AuthContextProps = typeof authState$;

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const isServer = typeof window === "undefined";
export const AuthProvider = observer(({ children }: { children: React.ReactNode }) => {
	const supabase = createClient();
	useObserveEffect(() => {
		if (isServer) return;

		const initializeAuth = async () => {
			try {
				authState$.isLoading.set(true);
				const {
					data: { session },
				} = await supabase.auth.getSession();
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (user) {
					const { data: profile } = await supabase
						.from("profiles")
						.select("*")
						.eq("id", user?.id ?? "")
						.single();
					authState$.profile.set(profile);
				} else {
					authState$.profile.set(null);
					await clearCloudStore();
				}
				authState$.assign({
					initialized: true,
					user,
					session,
				});
				await new Promise((resolve) => setTimeout(resolve, 100));
			} catch (error) {
				console.error("Auth initialization error:", error);
			} finally {
				authState$.isLoading.set(false);
			}
		};

		initializeAuth();

		const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
			authState$.assign({ session, user: session?.user });
			if (!session) {
				authState$.profile.set(null);
			}
		});
		const sub = supabase
			.channel("realtime profile")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "profiles",
					filter: `id=eq.${authState$.profile.id.get()}`,
				},
				(payload) => {
					authState$.profile.set(payload.new as Tables<"profiles">);
				},
			)
			.subscribe();

		return () => {
			sub.unsubscribe();
			authListener.subscription.unsubscribe();
		};
	});
	const value: AuthContextProps = authState$;

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
});

export const useAuth = (): AuthContextProps => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
