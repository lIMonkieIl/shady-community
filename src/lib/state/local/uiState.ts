import { observable, observe } from "@legendapp/state";
import type { TAccentName } from "../../constants/theme/Accents";
import type { TThemeMode, TThemeName } from "../../constants/theme/Themes";

export interface IThemeState {
	mode: TThemeMode;
	setMode: (mode: TThemeMode) => void;
	current: TThemeName;
	accent: TAccentName;
	setAccent: (accentName: TAccentName) => void;

	setTheme: (themeName: TThemeName) => void;
	isSelectionOpen: boolean;
}

const themeState$ = observable<IThemeState>({
	mode: "system",
	setMode: (mode) => {
		themeState$.mode.set(mode);
	},
	current: "DDS",
	accent: "hemp",
	setAccent(accentName) {
		themeState$.accent.set(accentName);
	},
	setTheme: (theme) => {
		themeState$.current.set(theme);
	},
	isSelectionOpen: false,
});

export interface IDrawerState {
	isOpen: boolean;
	close: () => void;
	open: () => void;
}
const drawerState$ = observable<IDrawerState>({
	isOpen: false,
	close: () => drawerState$.isOpen.set(false),
	open: () => drawerState$.isOpen.set(true),
});

export interface IUiState {
	theme: IThemeState;
	drawer: IDrawerState;
}

export const uiState$ = observable<IUiState>({
	theme: themeState$,
	drawer: drawerState$,
});
