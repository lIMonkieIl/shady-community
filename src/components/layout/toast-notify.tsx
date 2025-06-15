"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";
import { toast } from "../toast/toast";

function ToastListenerInner() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const toasts = useMemo(
		() => ({
			success: searchParams.get("success"),
			error: searchParams.get("error"),
		}),
		[searchParams],
	);

	useEffect(() => {
		if (toasts.error) {
			toast({ variant: "tonal-error", description: toasts.error, title: "Error" });
		}
		if (toasts.success) {
			toast({ variant: "tonal-success", description: toasts.success, title: "Success" });
		}

		// Only clean up if there are toast parameters to remove
		if (toasts.error || toasts.success) {
			// Create new URLSearchParams to preserve non-toast parameters
			const newParams = new URLSearchParams(searchParams);

			// Remove only the toast parameters
			newParams.delete("success");
			newParams.delete("error");

			// Build the new URL with preserved parameters
			const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;

			router.replace(newUrl, { scroll: false });
		}
	}, [toasts, pathname, router, searchParams]);

	return null;
}

// Wraps ToastListenerInner in Suspense to handle useSearchParams hydration
export function ToastListener() {
	return (
		<Suspense fallback={null}>
			<ToastListenerInner />
		</Suspense>
	);
}
