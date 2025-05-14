"use client";
import { signInAction, signUpAction } from "@/app/(auth)/auth/actions";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submitButton";
import { signInSchema, signUpSchema } from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { Show } from "@legendapp/state/react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

// Create a type that can represent either schema
type FormValues = z.infer<typeof signInSchema> | z.infer<typeof signUpSchema>;

export default function AuthForm({ isSignUp }: { isSignUp?: boolean }) {
	const formRef = useRef<HTMLFormElement>(null);

	// Set up action states
	const [signInFormState, signInFormAction] = useActionState(signInAction, {
		success: false,
		fields: { email: "", password: "" },
	});

	const [signUpFormState, signUpFormAction] = useActionState(signUpAction, {
		success: false,
	});

	const currentSchema = isSignUp ? signUpSchema : signInSchema;
	const currentState = isSignUp ? signUpFormState : signInFormState;

	const {
		register,
		formState: { errors: rhfErrors },
		setValue,
	} = useForm<FormValues>({
		resolver: zodResolver(currentSchema),
		mode: "onBlur",
	});

	useEffect(() => {
		// Set default values if needed
		setValue("email", currentState?.fields?.email || "");
		setValue("password", currentState?.fields?.password || "");
		if (isSignUp) {
			setValue("confirmPassword", currentState?.fields?.confirmPassword || "");
		}
	}, [isSignUp, setValue, currentState?.fields]);

	// Form submission handler
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		// Use startTransition for the server actions
		startTransition(() => {
			if (isSignUp) {
				signUpFormAction(formData);
			} else {
				signInFormAction(formData);
			}
		});
	};

	return (
		<div className="flex flex-col w-full gap-3 card preset-tonal-surface p-5">
			<div className="flex flex-col items-center">
				<span className="h3">{isSignUp ? "Sign up" : "Welcome back"}</span>
				<span className="text-current/70">
					{isSignUp ? "Sign up using your discord account" : "Sign in using your discord account"}
				</span>
			</div>
			<div className="flex w-full">
				<Button variant={"filled-primary"} className="w-full">
					<span>Discord</span>
					<SiDiscord size={18} />
				</Button>
			</div>
			<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border after:border-tertiary-400-600">
				<span className="relative z-10 bg-surface-50-950 px-2">
					<span className="text-tertiary-400-600">Or continue with</span>
				</span>
			</div>

			<form ref={formRef} onSubmit={handleSubmit} className={"grid items-start gap-4"}>
				<div className="grid gap-2">
					<label htmlFor="email" className="label">
						<span className="label-text">Email</span>
						<input required id="email" className="input" type="email" {...register("email")} />
						{currentState?.errors?.email && (
							<p className="text-destructive">{currentState.errors.email}</p>
						)}
						{rhfErrors.email?.message && (
							<p className="text-destructive">{rhfErrors.email.message}</p>
						)}
					</label>
				</div>
				<div className="grid gap-2">
					<label htmlFor="password" className="label">
						<span className="label-text">Password</span>
						<input
							required
							id="password"
							className="input"
							type="password"
							{...register("password")}
						/>
						{currentState?.errors?.password && (
							<p className="text-destructive">{currentState.errors.password}</p>
						)}
						{rhfErrors.password?.message && (
							<p className="text-destructive">{rhfErrors.password.message}</p>
						)}
					</label>
				</div>
				<Show if={isSignUp}>
					<div className="grid gap-2">
						<label htmlFor="confirm-password" className="label">
							<span className="label-text">Confirm Password</span>
							<input
								required
								id="confirm-password"
								className="input"
								type="password"
								{...register("confirmPassword")}
							/>
							{isSignUp && currentState?.errors?.confirmPassword && (
								<p className="text-destructive">{currentState.errors.confirmPassword}</p>
							)}
							{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
							{isSignUp && (rhfErrors as any).confirmPassword?.message && (
								// biome-ignore lint/suspicious/noExplicitAny: <explanation>
								<p className="text-destructive">{(rhfErrors as any).confirmPassword?.message}</p>
							)}
						</label>
					</div>
				</Show>
				<SubmitButton
					variant={"filled-primary"}
					className="flex items-center justify-center gap-2"
					pendingText={isSignUp ? "Signing up..." : "Signing in..."}
				>
					{isSignUp ? "Sign up" : "Sign in"}
				</SubmitButton>
				{currentState?.errors?.root && (
					<p className="text-destructive">{currentState.errors.root}</p>
				)}
				{rhfErrors.root?.message && <p className="text-destructive">{rhfErrors.root.message}</p>}
			</form>

			<div className="text-center text-sm">
				{isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
				<Button unstyled asChild>
					<Link className="anchor" href={isSignUp ? "/auth/sign-in" : "/auth/sign-up"}>
						{isSignUp ? "Sign in" : "Sign up"}
					</Link>
				</Button>
			</div>
		</div>
	);
}
