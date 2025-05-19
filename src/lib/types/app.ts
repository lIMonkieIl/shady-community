import type { TThemeDecoration, TThemeMode, TThemeName } from "../constants/theme/Themes";

export interface ITheme {
	mode: TThemeMode;
	name: TThemeName;
	decoration: TThemeDecoration;
}
