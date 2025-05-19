"use client";
import { use$, useObservable, useObserveEffect } from "@legendapp/state/react";
import { ThemeManager, type ThemeManagerProviderProps } from "./themeManager";

export const ThemeManagerProvider: React.FC<ThemeManagerProviderProps> = ({ ...props }) => {
	const mounted = useObservable(false);
	const isMounted = use$(mounted);

	useObserveEffect(() => {
		mounted.set(true);
	});

	if (!isMounted) {
		return null;
	}
	return <ThemeManager {...props} />;
};
