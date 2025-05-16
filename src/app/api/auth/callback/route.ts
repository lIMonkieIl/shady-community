// The client you created from the Server-Side Auth instructions
import { createClient } from "@/lib/supabase/server";
import { encodedRedirect } from "@/lib/utils/helpers";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/";

	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
			const isLocalEnv = process.env.NODE_ENV === "development";
			if (isLocalEnv) {
				// we can be sure that there is no load balancer in
				//  between, so no need to watch for X-Forwarded-Host
				return encodedRedirect("success", `${origin}${next}`, "Successfully authenticated");
			}
			if (forwardedHost) {
				return encodedRedirect(
					"success",
					`https://${forwardedHost}${next}`,
					"Successfully authenticated",
				);
			}

			return encodedRedirect("success", `${origin}${next}`, "Successfully authenticated");
		}
	}

	// return the user to an error page with instructions
	return encodedRedirect("error", "/auth/sign-in", "No code provided");
}
