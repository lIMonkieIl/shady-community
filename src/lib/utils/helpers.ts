import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prefixes, titles } from "../constants/theme/username-data";

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

import { redirect } from "next/navigation";

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
