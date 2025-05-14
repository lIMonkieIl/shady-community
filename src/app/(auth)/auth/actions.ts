"use server";
import "server-only";
import { validatedAction } from "@/lib/auth/middleware";
import { signInSchema, signUpSchema } from "@/lib/schemas/auth";
import { createClient } from "@/lib/supabase/server";
import { encodedRedirect, generateRandomUsername } from "@/lib/utils/helpers";
import { headers } from "next/headers";

export const signInAction = validatedAction(signInSchema, async (data, formData) => {
	const supabase = await createClient();
	const signIn = await supabase.auth.signInWithPassword({
		email: data.email,
		password: data.password,
	});

	if (signIn.error) {
		const fields: Record<string, string> = {};
		for (const key of Object.keys(formData)) {
			fields[key] = formData.get(key)?.toString() || "";
		}
		return {
			success: false,
			fields,
			errors: { root: [signIn.error.message] },
		};
	}

	return encodedRedirect("success", "/auth/sign-in", "Successfully authenticated");
});

export const signUpAction = validatedAction(signUpSchema, async (data, formData) => {
	const supabase = await createClient();
	const origin = (await headers()).get("origin");
	const signUp = await supabase.auth.signUp({
		email: data.email,
		password: data.password,
		options: {
			emailRedirectTo: `${origin}/auth/confirm`,
			data: { username: generateRandomUsername() },
		},
	});

	if (signUp.error) {
		const fields: Record<string, string> = {};
		for (const key of Object.keys(formData)) {
			fields[key] = formData.get(key)?.toString() || "";
		}
		return {
			success: false,
			fields,
			errors: { root: [signUp.error.message] },
		};
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (user) {
		return encodedRedirect("success", "/auth/sign-in", "Successfully authenticated");
	}

	return encodedRedirect(
		"success",
		"/auth/sign-in",
		"Thanks for signing up! Please check your email for a verification link.",
	);
});

export const signOutAction = async () => {
	const supabase = await createClient();
	await supabase.auth.signOut();

	return encodedRedirect("success", "/", "Successfully signed out");
};
