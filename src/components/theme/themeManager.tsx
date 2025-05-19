"use client ";
import {
	type IThemeDecorationList,
	type IThemeNameList,
	type TThemeDecoration,
	type TThemeMode,
	type TThemeName,
	ThemeDecorationList,
	ThemeModesList,
	ThemeNameList,
} from "@/lib/constants/theme/Themes";
import { themePreferencesState$ } from "@/lib/state/cloud/themePreferences";
import { use$, useObservable, useObserveEffect } from "@legendapp/state/react";
import React from "react";
import { script } from "./script.ts";

export type TThemeManagerAttributes = {
	mode: TThemeMode; // dark | light | system
	name: TThemeName; // crimson | skeleton | vox
	decoration: TThemeDecoration; // none | skull | hemp
};

export interface ThemeManagerProviderProps extends React.PropsWithChildren {
	forcedThemeName?: TThemeName | undefined;
	defaultThemeName?: TThemeName | undefined;
	forcedThemeMode?: TThemeMode | undefined;
	defaultThemeMode?: TThemeMode | undefined;
	forcedThemeDecoration?: TThemeDecoration | undefined;
	defaultThemeDecoration?: TThemeDecoration | undefined;
}

export interface UseThemeManagerProps {
	themeModes: TThemeMode[];
	themeNames: IThemeNameList[];
	themeDecorations: IThemeDecorationList[];
	forcedThemeName?: TThemeName | undefined;
	defaultThemeName?: TThemeName | undefined;
	forcedThemeMode?: TThemeMode | undefined;
	defaultThemeMode?: TThemeMode | undefined;
	forcedThemeDecoration?: TThemeDecoration | undefined;
	defaultThemeDecoration?: TThemeDecoration | undefined;
	setTheme: (theme: Partial<TThemeManagerAttributes>) => void;
	currentThemeName: TThemeManagerAttributes["name"];
	currentThemeMode: TThemeManagerAttributes["mode"];
	currentThemeDecoration: TThemeManagerAttributes["decoration"];
	resolvedSystemThemeMode?: TThemeManagerAttributes["mode"] | undefined;
	systemThemeMode?: "dark" | "light" | undefined;
}
const MEDIA = "(prefers-color-scheme: dark)";
const isServer = typeof window === "undefined";
const ThemeContext = React.createContext<UseThemeManagerProps | undefined>(undefined);

// Default values
const defaultThemeManagerAttrs: TThemeManagerAttributes = {
	mode: "system",
	name: "DDS",
	decoration: "none",
};

const defaultThemeManagerContext: UseThemeManagerProps = {
	setTheme: () => {},
	currentThemeName: defaultThemeManagerAttrs.name,
	currentThemeMode: defaultThemeManagerAttrs.mode,
	currentThemeDecoration: defaultThemeManagerAttrs.decoration,
	themeModes: ThemeModesList,
	themeNames: ThemeNameList,
	themeDecorations: ThemeDecorationList,
};

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent): "dark" | "light" => {
	// biome-ignore lint/style/noParameterAssign: <explanation>
	if (!e) e = window.matchMedia(MEDIA);
	return e.matches ? "dark" : "light";
};

const getThemeTransitionStyle = () => {
	const css = document.createElement("style");
	css.appendChild(
		document.createTextNode(
			`html {
				transition: background-color 1s ease, color 1s ease;
			}
			* {
				transition: background-color 1s ease, border-color 1s ease, color 1s ease, fill 1s ease, stroke 1s ease, outline-color 1s ease;
			}`,
		),
	);
	return css;
};

export const useThemeManager = () => React.useContext(ThemeContext) ?? defaultThemeManagerContext;

export const ThemeManager: React.FC<ThemeManagerProviderProps> = ({
	defaultThemeDecoration,
	defaultThemeMode,
	defaultThemeName,
	forcedThemeDecoration,
	forcedThemeMode,
	forcedThemeName,
	children,
}) => {
	const themePreferences = use$(themePreferencesState$.value) as TThemeManagerAttributes;

	const resolvedSystemThemeMode = useObservable(() =>
		themePreferences.mode === "system"
			? getSystemTheme()
			: (themePreferences.mode as "light" | "dark"),
	);
	useObserveEffect(() => {
		if (isServer) {
			return;
		}

		const transitionStyle = getThemeTransitionStyle();
		document.head.appendChild(transitionStyle);

		return () => {
			document.head.removeChild(transitionStyle);
		};
	});

	useObserveEffect(() => {
		if (isServer) return;

		// Subscribe to changes in the observable
		const subscription = themePreferencesState$.value.onChange((newValue) => {
			applyTheme(newValue.value as TThemeManagerAttributes);
		});

		return () => {
			// Clean up subscription
			subscription();
		};
	});

	// Apply theme attributes to document
	const applyTheme = (themeAttrs: TThemeManagerAttributes) => {
		if (isServer) return;

		const d = document.documentElement;
		// Resolve system preference if mode is "system"
		const resolvedAttrs = { ...themeAttrs };
		if (resolvedAttrs.mode === "system") {
			resolvedAttrs.mode = getSystemTheme();
		}

		// Apply data attributes
		d.setAttribute("data-mode", resolvedAttrs.mode);
		d.setAttribute("data-theme", resolvedAttrs.name);
		d.setAttribute("data-decoration", resolvedAttrs.decoration);

		// Apply color scheme
		d.style.colorScheme = resolvedAttrs.mode;
	};

	// Update theme with new values
	const setTheme = (value: Partial<TThemeManagerAttributes>) => {
		themePreferencesState$.value.assign({ ...value });
	};

	const handleMediaQuery = (e: MediaQueryListEvent | MediaQueryList) => {
		const resolved = getSystemTheme(e);
		resolvedSystemThemeMode.set(resolved);

		if (themePreferences.mode === "system" && !forcedThemeName) {
			applyTheme({ ...(themePreferences as TThemeManagerAttributes), mode: resolved });
		}
	};

	useObserveEffect(() => {
		if (isServer) return;

		const media = window.matchMedia(MEDIA);
		media.addEventListener("change", handleMediaQuery);
		handleMediaQuery(media);

		return () => media.removeEventListener("change", handleMediaQuery);
	});

	useObserveEffect(() => {
		applyTheme(themePreferences);
	});

	const value: UseThemeManagerProps = {
		currentThemeDecoration: themePreferences.decoration,
		currentThemeName: themePreferences.name,
		currentThemeMode: themePreferences.mode,
		themeModes: ThemeModesList,
		themeNames: ThemeNameList,
		themeDecorations: ThemeDecorationList,
		setTheme,
		defaultThemeDecoration,
		defaultThemeMode,
		defaultThemeName,
		forcedThemeDecoration,
		forcedThemeMode,
		forcedThemeName,
		resolvedSystemThemeMode:
			themePreferences.mode === "system" ? resolvedSystemThemeMode.get() : themePreferences.mode,
		systemThemeMode: resolvedSystemThemeMode.get(),
	};

	return (
		<ThemeContext.Provider value={value}>
			<ThemeScript themePreferences={themePreferences} />
			{children}
		</ThemeContext.Provider>
	);
};

const ThemeScript = ({ themePreferences }: { themePreferences: TThemeManagerAttributes }) => {
	const scriptArgs = JSON.stringify(themePreferences);

	return (
		<script
			suppressHydrationWarning
			// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
			dangerouslySetInnerHTML={{ __html: `(${script.toString()})(${scriptArgs})` }}
		/>
	);
};
