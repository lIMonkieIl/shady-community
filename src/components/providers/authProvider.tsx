"use client";

import { authState$ } from "@/lib/state/local/authState";
import { uiState$ } from "@/lib/state/local/uiState";
import { createClient } from "@/lib/supabase/client";
import { useObserve } from "@legendapp/state/react";
import type { ReactNode } from "react";
import { createContext, useEffect } from "react";

const AuthContext = createContext<typeof authState$>(authState$);

export function AuthProvider({ children }: { children: ReactNode }) {
	const supabase = createClient();

	useEffect(() => {
		supabase.auth.getSession().then(async ({ data: { session } }) => {
			let profile = null;
			if (session?.user) {
				const { data } = await supabase
					.from("profiles")
					.select("*")
					.eq("id", session.user.id)
					.single();
				profile = data;
			}
			authState$.set((prev) => ({
				...prev,
				session,
				user: session?.user ?? null,
				profile,
				isLoading: false,
			}));
		});

		const {
			data: { subscription: authSubscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === "SIGNED_OUT") {
				authState$.set((prev) => ({
					...prev,
					session: null,
					user: null,
					profile: null,
					isLoading: false,
				}));
				return;
			}
			if (event === "SIGNED_IN") {
				if (session?.user?.id) {
					const { data: profile } = await supabase
						.from("profiles")
						.select("*")
						.eq("id", session.user.id)
						.single();
					authState$.set((prev) => ({
						...prev,
						session,
						user: session.user,
						profile,
						isLoading: false,
					}));
				}
				return;
			}
			authState$.set((prev) => ({
				...prev,
				session,
				user: session?.user ?? null,
				isLoading: false,
			}));
		});

		// Subscribe to profile changes
		const profileSubscription = supabase
			.channel("defualt")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "profiles",
				},
				async (payload) => {
					console.log(payload);
					if (payload.new && "id" in payload.new) {
						const { data: profile } = await supabase
							.from("profiles")
							.select("*")
							.eq("id", payload.new.id)
							.single();
						authState$.set((prev) => ({
							...prev,
							profile,
						}));
					}
				},
			)
			.subscribe();

		return () => {
			authSubscription.unsubscribe();
			profileSubscription.unsubscribe();
		};
	}, [supabase]);

	useObserve(() => {
		if (authState$.isAuthenticated.get() && uiState$.modals.state.auth.open.get()) {
			uiState$.modals.closeModal("auth");
		}
	});

	return <AuthContext.Provider value={authState$}>{children}</AuthContext.Provider>;
}
