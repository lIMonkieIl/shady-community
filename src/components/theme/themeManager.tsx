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
import { user_themePreferencesState$ } from "@/lib/state/cloud/userThemePreferences";
import { authState$ } from "@/lib/state/local/authState";
import { local_themePreferencesState$ } from "@/lib/state/local/localThemePreferences";
import type { ITheme } from "@/lib/types/app";
import { use$, useObservable, useObserveEffect } from "@legendapp/state/react";
import React, { useContext } from "react";
// import { script } from "./script";

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
	setTheme: (theme: Partial<ITheme>) => void;
	currentThemeName: ITheme["name"];
	currentThemeMode: ITheme["mode"];
	currentThemeDecoration: ITheme["decoration"];
	resolvedSystemThemeMode?: ITheme["mode"] | undefined;
	systemThemeMode?: "dark" | "light" | undefined;
}
const MEDIA = "(prefers-color-scheme: dark)";
const isServer = typeof window === "undefined";
const ThemeContext = React.createContext<UseThemeManagerProps | undefined>(undefined);

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent): "dark" | "light" => {
	// biome-ignore lint/style/noParameterAssign: <explanation>
	if (!e) e = window.matchMedia(MEDIA);
	return e.matches ? "dark" : "light";
};

// const getThemeTransitionStyle = () => {
// 	const css = document.createElement("style");
// 	css.appendChild(
// 		document.createTextNode(
// 			`html {
// 				transition: background-color 1s ease, color 1s ease;
// 			}
// 			* {
// 				transition: background-color 1s ease, border-color 1s ease, color 1s ease, fill 1s ease, stroke 1s ease, outline-color 1s ease;
// 			}`,
// 		),
// 	);
// 	return css;
// };

export const useThemeManager = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const ThemeManager: React.FC<ThemeManagerProviderProps> = ({
	defaultThemeDecoration,
	defaultThemeMode,
	defaultThemeName,
	forcedThemeDecoration,
	forcedThemeMode,
	forcedThemeName,
	children,
}) => {
	const prefs = useObservable<ITheme>(() => {
		if (authState$.isAuthed.get()) {
			return user_themePreferencesState$.value.get() as ITheme;
		}
		return local_themePreferencesState$;
	});
	const themePreferences = use$(prefs) as ITheme;

	const resolvedSystemThemeMode = useObservable(() =>
		themePreferences.mode === "system"
			? getSystemTheme()
			: (themePreferences.mode as "light" | "dark"),
	);
	// useMountOnce(() => {
	// 	const transitionStyle = getThemeTransitionStyle();
	// 	document.head.appendChild(transitionStyle);

	// 	return () => {
	// 		document.head.removeChild(transitionStyle);
	// 	};
	// });

	useObserveEffect(() => {
		if (isServer) return;

		// Subscribe to changes in the observable
		const subscription = local_themePreferencesState$.onChange((newValue) => {
			applyTheme(newValue.value as ITheme);
		});

		return () => {
			// Clean up subscription
			subscription();
		};
	});
	useObserveEffect(() => {
		if (isServer) return;

		// Subscribe to changes in the observable
		const subscription = user_themePreferencesState$.onChange((newValue) => {
			if (authState$.isAuthed.get()) {
				applyTheme(newValue.value.value as ITheme);
			}
		});

		return () => {
			// Clean up subscription
			subscription();
		};
	});
	useObserveEffect(authState$.isAuthed, () => {
		if (authState$.isAuthed.get()) {
			prefs.set(user_themePreferencesState$.value.get() as ITheme);
		} else {
			prefs.set(local_themePreferencesState$);
		}
	});

	// Apply theme attributes to document
	const applyTheme = (themeAttrs: ITheme) => {
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
	const setTheme = (value: Partial<ITheme>) => {
		if (authState$.isAuthed.get()) {
			user_themePreferencesState$.value.assign({ ...value });
		} else {
			local_themePreferencesState$.assign({ ...value });
		}
	};

	const handleMediaQuery = (e: MediaQueryListEvent | MediaQueryList) => {
		const resolved = getSystemTheme(e);
		resolvedSystemThemeMode.set(resolved);

		if (themePreferences.mode === "system" && !forcedThemeName) {
			applyTheme({ ...(themePreferences as ITheme), mode: resolved });
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
			{/* <ThemeScript
				localStorageKey="local_theme_preferences"
				userStorageKey="user_theme_preferences"
				defaultTheme={{
					name: defaultThemeName || "DDS",
					mode: defaultThemeMode || "system",
					decoration: defaultThemeDecoration || "none",
				}}
			/> */}
			{children}
		</ThemeContext.Provider>
	);
};

// export const ThemeScript = React.memo(
// 	({
// 		localStorageKey = "local_theme_preferences",
// 		userStorageKey = "user_theme_preferences",
// 		defaultTheme = {
// 			name: "DDS",
// 			mode: "system",
// 			decoration: "none",
// 		},
// 		...scriptProps
// 	}: {
// 		localStorageKey?: string;
// 		userStorageKey?: string;
// 		defaultTheme?: ITheme;
// 	}) => {
// 		const scriptArgs = JSON.stringify([localStorageKey, userStorageKey, defaultTheme]).slice(1, -1);

// 		return (
// 			<script
// 				{...scriptProps}
// 				suppressHydrationWarning
// 				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
// 				dangerouslySetInnerHTML={{
// 					__html: `(${script.toString()})(${scriptArgs})`,
// 				}}
// 			/>
// 		);
// 	},
// );
