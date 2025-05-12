import { type ClassValue, clsx } from "clsx";
import { redirect } from "next/navigation";
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

export function formatUSD(value: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
	}).format(value);
}
export const formatWeight = (grams: number): string => {
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
};

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
	type: "error" | "success",
	path: string,
	message: string,
) {
	const url = new URL(path, "http://dummy"); // dummy origin just for parsing
	url.searchParams.set(type, message);
	return redirect(`${url.pathname}?${url.searchParams.toString()}`);
}

export function generateRandomUsername(): string {
	const randomAdjective = prefixes[Math.floor(Math.random() * prefixes.length)];
	const randomAnimal = titles[Math.floor(Math.random() * titles.length)];
	const randomNumber = Math.floor(Math.random() * 1000);

	return capitalizeWords(`${randomAdjective}${randomAnimal}${randomNumber}`);
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
