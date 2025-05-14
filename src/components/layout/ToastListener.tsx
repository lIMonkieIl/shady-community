"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

const ToastType = {
	SUCCESS: "success",
	ERROR: "error",
	WARN: "warn",
	INFO: "info",
} as const;

export type ToastTypeValue = (typeof ToastType)[keyof typeof ToastType];

export type Message = {
	type: ToastTypeValue;
	message: string;
};

// Create the inner component that uses search params
function ToastListenerInner() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		// Check for toast parameters
		const toastSuccess = searchParams.get(`toast-${ToastType.SUCCESS}`);
		const toastError = searchParams.get(`toast-${ToastType.ERROR}`);
		const toastWarn = searchParams.get(`toast-${ToastType.WARN}`);
		const toastInfo = searchParams.get(`toast-${ToastType.INFO}`);

		// Create a new URLSearchParams instance to manipulate
		const params = new URLSearchParams(searchParams);

		// Display the appropriate toast based on parameters
		if (toastSuccess) {
			toast.success(toastSuccess);
			params.delete(`toast-${ToastType.SUCCESS}`);
		}
		if (toastError) {
			toast.error(toastError);
			params.delete(`toast-${ToastType.ERROR}`);
		}
		if (toastWarn) {
			toast.warning(toastWarn);
			params.delete(`toast-${ToastType.WARN}`);
		}
		if (toastInfo) {
			toast.info(toastInfo);
			params.delete(`toast-${ToastType.INFO}`);
		}

		const newParams = params.toString();
		const newUrl = newParams ? `${pathname}?${newParams}` : pathname;

		// Use replace to avoid adding to history stack
		router.replace(newUrl, { scroll: false });
	}, [searchParams, router, pathname]);

	// This component doesn't render anything
	return null;
}

// The main export component wraps the inner component with Suspense
export function ToastListener() {
	return (
		<Suspense fallback={null}>
			<ToastListenerInner />
		</Suspense>
	);
}
