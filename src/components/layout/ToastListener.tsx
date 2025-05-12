"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function ToastListener() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const hasShownToast = useRef(false); // Prevent duplicate toasts

	useEffect(() => {
		if (hasShownToast.current) return;

		const success = searchParams.get("success");
		const error = searchParams.get("error");

		if (success) toast.success(success);
		if (error) toast.error(error);

		if (success || error) {
			hasShownToast.current = true;

			const url = new URL(window.location.href);
			url.searchParams.delete("success");
			url.searchParams.delete("error");
			window.history.replaceState({}, "", pathname);
		}
	}, [pathname, searchParams]);

	return null;
}
