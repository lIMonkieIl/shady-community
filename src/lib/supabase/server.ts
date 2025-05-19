import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "../types/database.types";

export async function createClient() {
	const cookieStore = await cookies();

	// Create a server's supabase client with newly configured cookie,
	// which could be used to maintain user's session
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
		{
			auth: {
				storageKey: "sc-auth",
				autoRefreshToken: true,
				persistSession: true,
				detectSessionInUrl: true,
			},

			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						for (const cookie of cookiesToSet) {
							const { name, value, options } = cookie;
							cookieStore.set(name, value, options);
						}
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		},
	);
}
