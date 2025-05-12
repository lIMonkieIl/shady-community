export const AccentNames = {
	none: "none",
	hemp: "hemp",
	skull: "skull",
} as const;

export type TAccentName = keyof typeof AccentNames;

export interface IAccent {
	name: TAccentName;
	label: string;
	source: string;
}

export const Accents: IAccent[] = [
	{ name: "none", label: "Blank", source: "" },
	{ name: "hemp", label: "Hemp", source: "/hemp-hemp-svgrepo-com.svg" },
	{ name: "skull", label: "Skull", source: "💀" },
];
