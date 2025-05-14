// ToastListener.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

function ToastListenerContent() {
	const searchParams = useSearchParams();

	useEffect(() => {
		const success = searchParams.get("success");
		const error = searchParams.get("error");

		if (success) toast.success(success);
		if (error) toast.error(error);

		if (success || error) {
			const url = new URL(window.location.href);
			url.searchParams.delete("success");
			url.searchParams.delete("error");
			window.history.replaceState({}, "", url.toString());
		}
	}, [searchParams]);

	return null;
}

export function ToastListener() {
	return (
		<Suspense fallback={null}>
			<ToastListenerContent />
		</Suspense>
	);
}
