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
			toast({ type: "error", description: toasts.error, title: "Error" });
		}
		if (toasts.success) {
			toast({ type: "success", description: toasts.success, title: "Success" });
		}
		const newUrl = pathname;

		router.replace(newUrl, { scroll: false });
	}, [toasts, pathname, router.replace]);

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
