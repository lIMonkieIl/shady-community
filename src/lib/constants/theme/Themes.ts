export const ThemeNames = {
	catppuccin: "catppuccin",
	cerberus: "cerberus",
	concord: "concord",
	crimson: "crimson",
	fennec: "fennec",
	hamlindigo: "hamlindigo",
	legacy: "legacy",
	mint: "mint",
	modern: "modern",
	mona: "mona",
	nosh: "nosh",
	nouveau: "nouveau",
	pine: "pine",
	reign: "reign",
	rocket: "rocket",
	rose: "rose",
	sahara: "sahara",
	seafoam: "seafoam",
	terminus: "terminus",
	vintage: "vintage",
	vox: "vox",
	wintry: "wintry",
	DDS: "DDS",
} as const;

export type TThemeName = keyof typeof ThemeNames;

export interface IThemeNameList {
	name: TThemeName;
	label: string;
	emoji: string;
}

export const ThemeNameList: IThemeNameList[] = [
	{ name: "catppuccin", label: "Catppuccin", emoji: "🐈" },
	{ name: "cerberus", label: "Cerberus", emoji: "🐺" },
	{ name: "concord", label: "Concord", emoji: "🤖" },
	{ name: "crimson", label: "Crimson", emoji: "🔴" },
	{ name: "fennec", label: "Fennec", emoji: "🦊" },
	{ name: "hamlindigo", label: "Hamlindigo", emoji: "👔" },
	{ name: "legacy", label: "Legacy", emoji: "💀" },
	{ name: "mint", label: "Mint", emoji: "🍃" },
	{ name: "modern", label: "Modern", emoji: "🌸" },
	{ name: "mona", label: "Mona", emoji: "🐙" },
	{ name: "nosh", label: "Nosh", emoji: "🥙" },
	{ name: "nouveau", label: "Nouveau", emoji: "👑" },
	{ name: "pine", label: "Pine", emoji: "🌲" },
	{ name: "reign", label: "Reign", emoji: "📒" },
	{ name: "rocket", label: "Rocket", emoji: "🚀" },
	{ name: "rose", label: "Rose", emoji: "🌷" },
	{ name: "sahara", label: "Sahara", emoji: "🏜️" },
	{ name: "seafoam", label: "Seafoam", emoji: "🧜‍♀️" },
	{ name: "terminus", label: "Terminus", emoji: "🌑" },
	{ name: "vintage", label: "Vintage", emoji: "📺" },
	{ name: "vox", label: "Vox", emoji: "👾" },
	{ name: "wintry", label: "Wintry", emoji: "🌨️" },
	{ name: "DDS", label: "DDS", emoji: "💊" },
];

export const ThemeModes = {
	Dark: "dark",
	Light: "light",
	System: "system",
} as const;

export type TThemeMode = (typeof ThemeModes)[keyof typeof ThemeModes];
export const ThemeModesList: TThemeMode[] = Object.values(ThemeModes);

export const ThemeDecoration = {
	none: "none",
	hemp: "hemp",
	skull: "skull",
} as const;

export type TThemeDecoration = keyof typeof ThemeDecoration;

export interface IThemeDecorationList {
	name: TThemeDecoration;
	label: string;
	source: string;
}

export const ThemeDecorationList: IThemeDecorationList[] = [
	{ name: "none", label: "Blank", source: "" },
	{ name: "hemp", label: "Hemp", source: "/hemp-hemp-svgrepo-com.svg" },
	{ name: "skull", label: "Skull", source: "💀" },
];
