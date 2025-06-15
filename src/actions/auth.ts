"use server";

import { signInSchema } from "@/lib/schemas/auth";
import { signUpSchema } from "@/lib/schemas/auth";
import { clearCloudStore } from "@/lib/state/helpers";
import { createClient } from "@/lib/supabase/server";
import { generateRandomUsername } from "@/lib/utils/helpers";
import { actionClient } from "@/lib/utils/safe-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = actionClient
	.metadata({
		actionName: "signUpAction",
		description: "Sign up a new user with email & password.",
	})
	.schema(signUpSchema)
	.action(async ({ parsedInput }) => {
		const { email, password } = parsedInput;
		const supabase = await createClient();
		const origin = (await headers()).get("origin");
		const signUp = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${origin}/auth/confirm`,
				data: { username: generateRandomUsername() },
			},
		});
		if (signUp.error) {
			throw signUp.error;
		}
		const { data: user } = await supabase.auth.getUser();
		if (user) {
			return { success: "Successfully authenticated." };
		}
		return { success: "Thanks for signing up! Please check your email for a verification link." };
	});

export const signInAction = actionClient
	.metadata({ actionName: "signInAction", description: "Sign in a user with email & password." })
	.schema(signInSchema)
	.action(async ({ parsedInput }) => {
		const { email, password } = parsedInput;
		const supabase = await createClient();
		const signIn = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (signIn.error) {
			throw signIn.error;
		}
		revalidatePath("/");

		return { success: "Successfully authenticated." };
	});

export const signOutAction = actionClient
	.metadata({ actionName: "SignOutAction", description: "Sign out a user" })
	.action(async () => {
		const supabase = await createClient();
		const siginOut = await supabase.auth.signOut();
		if (siginOut.error) {
			throw siginOut.error;
		}
		await clearCloudStore();
		return { success: "Successfully signed out." };
	});

export const signInWithDiscordAction = actionClient
	.metadata({
		actionName: "SignInWithDiscordAction",
		description: "sign in a user and verify with discord",
	})
	.action(async () => {
		const supabase = await createClient();
		const origin = (await headers()).get("origin");
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "discord",
			options: {
				redirectTo: `${origin}/api/auth/callback`,
			},
		});
		if (error) {
			throw error;
		}
		return redirect(data.url);
	});
