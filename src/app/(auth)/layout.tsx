import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		// Get the return URL from the current request
		const headersList = await headers();
		const fullUrl = headersList.get("x-url") || headersList.get("referer") || "";

		// Extract returnUrl from query parameters
		let returnUrl = "/";
		if (fullUrl) {
			try {
				const url = new URL(fullUrl);
				const returnUrlParam = url.searchParams.get("returnUrl");
				if (returnUrlParam) {
					returnUrl = decodeURIComponent(returnUrlParam);

					// Validate the return URL for security
					// Only allow relative URLs or same-origin URLs
					if (returnUrl.startsWith("/") && !returnUrl.startsWith("//")) {
						// Valid relative URL
					} else if (returnUrl.startsWith("http")) {
						const returnUrlObj = new URL(returnUrl);
						const currentUrlObj = new URL(fullUrl);
						if (returnUrlObj.origin !== currentUrlObj.origin) {
							// Different origin, use default
							returnUrl = "/";
						}
					} else {
						// Invalid format, use default
						returnUrl = "/";
					}
				}
			} catch (_error) {
				// If URL parsing fails, use default
				returnUrl = "/";
			}
		}

		return redirect(returnUrl);
	}

	return <>{children}</>;
}
