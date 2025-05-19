"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const AuthPageBodyClass = () => {
	const pathname = usePathname();

	useEffect(() => {
		const isAuthPage = pathname.startsWith("/auth");

		if (isAuthPage) {
			document.body.classList.add("gradient-auth");
		} else {
			document.body.classList.remove("gradient-auth");
		}
	}, [pathname]);

	return null;
};
