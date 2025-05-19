"use client";
import { use$, useObservable, useObserveEffect } from "@legendapp/state/react";

export function useMediaQuery(query: string): boolean {
	const matches = useObservable(false);
	const isMatches = use$(matches);

	useObserveEffect(() => {
		if (typeof window === "undefined") return;

		const media = window.matchMedia(query);
		if (media.matches !== isMatches) {
			matches.set(media.matches);
		}

		const listener = () => matches.set(media.matches);
		media.addEventListener("change", listener);

		return () => media.removeEventListener("change", listener);
	});

	return isMatches;
}
