import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "../types/supabase.types";

export async function updateSession(request: NextRequest) {
	try {
		// Create an unmodified response
		let response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		});

		const supabase = createServerClient<Database>(
			process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
			{
				auth: { storageKey: "sc-auth" },
				cookies: {
					getAll() {
						return request.cookies.getAll();
					},
					setAll(cookiesToSet) {
						for (const cookie of cookiesToSet) {
							const { name, value } = cookie;
							request.cookies.set(name, value);
						}
						response = NextResponse.next({
							request,
						});
						for (const cookie of cookiesToSet) {
							const { name, value, options } = cookie;
							response.cookies.set(name, value, options);
						}
					},
				},
			},
		);

		await supabase.auth.getUser();
		return response;
	} catch (e) {
		// If you are here, a Supabase client could not be created!
		// This is likely because you have not set up environment variables.
		// Check out http://localhost:3000 for Next Steps.
		return NextResponse.next({
			request: {
				headers: request.headers,
			},
		});
	}
}
