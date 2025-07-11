import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prefixes, titles } from "../constants/theme/username-data";
import QualitativeTable from "../data/qualitative_table.json";
export function capitalizeWords(str: string): string {
	return str
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function formatDuration(hours: number): string {
	const d = Math.floor(hours / 24);
	const h = Math.floor(hours % 24);
	const m = Math.round((hours - Math.floor(hours)) * 60);

	const parts = [];
	if (d) parts.push(`${d} day${d !== 1 ? "s" : ""}`);
	if (h) parts.push(`${h} hour${h !== 1 ? "s" : ""}`);
	if (m && d === 0) parts.push(`${m} minute${m !== 1 ? "s" : ""}`);
	if (!parts.length) {
		return "0 minutes";
	}
	return parts.join(", ");
}

export function formatUSD(value: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
	}).format(value);
}

export function formatWeight(grams: number): string {
	if (grams < 1) {
		return `${(grams * 1000).toFixed(0)} mg`;
	}
	if (grams < 1000) {
		return `${grams.toFixed(2)} g`;
	}
	if (grams < 1_000_000) {
		return `${(grams / 1000).toFixed(2)} kg`;
	}
	return `${(grams / 1_000_000).toFixed(2)} t`;
}

import type { IIngredient } from "@/hooks/useIngredientsManager";
import type { IMix } from "@/hooks/useMixesManager";
import { redirect } from "next/navigation";
import type { z } from "zod";

export function encodedRedirect(type: "error" | "success", path: string, message: string) {
	return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function generateRandomUsername(): string {
	const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
	const randomTitle = titles[Math.floor(Math.random() * titles.length)];

	return capitalizeWords(`${randomPrefix}_${randomTitle}`);
}

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export const wait = (seconds: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, seconds * 1000);
	});
};

export function getInitials(name: string | null): string {
	if (!name) return "sc";

	// Split by spaces and get first letter of each word (up to 2)
	const parts = name
		.trim()
		.split(/[\s\-_\.]+/)
		.filter((part) => part.length > 0);
	if (parts.length === 1) {
		return parts[0].charAt(0).toUpperCase();
	}
	return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function formatDiff(value: number): string {
	const sign = value > 0 ? "+" : value < 0 ? "−" : "";
	return `${sign} ${Math.abs(value).toFixed(2)}`;
}

export function getColorForValue(value: number): string {
	const match = QualitativeTable.find((entry) => value >= entry.min && value <= entry.max);
	return match?.color || "preset-tonal"; // fallback to white if not found
}

export const clampNumber = (val: number, min: number, max: number) =>
	Math.min(Math.max(val, min), max);

export function validateField<T>(schema: z.ZodType<T>, value: unknown) {
	const result = schema.safeParse(value);

	if (result.success) {
		return {
			ok: true,
			errors: null,
			data: result.data,
		};
	}

	const errors = result.error.errors.map((e) => e.message);
	return {
		ok: false,
		errors,
		data: null,
	};
}
export function isIngredient(i: IIngredient | IMix): i is IIngredient {
	return "type" in i;
}

export function isMixIngredient(i: IIngredient | IMix): i is IMix {
	return "parent_ingredient_id" in i;
}

export function getStringAndNumberKeys<T extends object>(obj: T): (keyof T)[] {
	return Object.keys(obj).filter((key) => {
		const value = obj[key as keyof T];
		return typeof value === "string" || typeof value === "number";
	}) as (keyof T)[];
}
