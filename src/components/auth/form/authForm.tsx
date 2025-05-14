"use client";
import { signInAction, signUpAction } from "@/app/(auth)/auth/actions";
import { Button } from "@/components/ui/button";
import { signInSchema, signUpSchema } from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { Show } from "@legendapp/state/react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export default function AuthForm({ isSignUp }: { isSignUp?: boolean }) {
	const [signInFormState, signInFormAction] = useActionState(signInAction, {
		success: false,
		fields: { email: "example@example.com", password: "123456789" },
	});
	const [signUpFormState, signUpFormAction] = useActionState(signUpAction, {
		success: false,
	});

	const formRef = useRef<HTMLFormElement>(null);

	const currentAction = isSignUp ? signUpFormAction : signInFormAction;
	const currentState = isSignUp ? signUpFormState : signInFormState;
	const currentSchema = isSignUp ? signUpSchema : signInSchema;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors: rhfErrors },
	} = useForm<z.infer<typeof currentSchema>>({
		resolver: zodResolver(currentSchema),
		defaultValues: {
			...(currentState?.fields ?? {}),
		} as z.infer<typeof currentSchema>,
		mode: "onBlur",
	});

	useEffect(() => {
		const defaultVals = {
			email: currentState?.fields?.email ?? "",
			password: currentState?.fields?.password ?? "",
			...(isSignUp
				? {
						confirmPassword:
							// biome-ignore lint/suspicious/noExplicitAny: <explanation>
							(currentState?.fields as any)?.confirmPassword ?? "",
					}
				: {}),
		};
		reset(defaultVals as z.infer<typeof currentSchema>);
	}, [isSignUp, reset, currentState?.fields]);

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
			<form
				ref={formRef}
				action={currentAction}
				onSubmit={(evt) => {
					evt.preventDefault();
					handleSubmit(() => {
						startTransition(() =>
							currentAction(new FormData(formRef.current ? formRef.current : undefined)),
						);
					})(evt);
				}}
				className={"grid items-start gap-4"}
			>
				<div className="grid gap-2">
					<label htmlFor="email" className="label">
						<span className="label-text">Email</span>
						<input required id="email" className="input" type="email" {...register("email")} />
						{currentState?.errors?.email && (
							<p className="text-destructive">{currentState?.errors?.email}</p>
						)}
						{rhfErrors.email?.message && (
							<p className="text-destructive">{rhfErrors.email?.message}</p>
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
							<p className="text-destructive">{currentState?.errors?.password}</p>
						)}
						{rhfErrors.password?.message && (
							<p className="text-destructive">{rhfErrors.password?.message}</p>
						)}
					</label>
				</div>
				<Show if={isSignUp}>
					<div className="grid gap-2">
						<label htmlFor="confirm-Password" className="label">
							<span className="label-text">Confirm Password</span>
							<input
								required
								id="confirm-password"
								className="input"
								type="password"
								// biome-ignore lint/suspicious/noExplicitAny: <explanation>
								{...register("confirmPassword" as any)}
							/>
							{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
							{isSignUp && (currentState?.errors as any)?.confirmPassword && (
								<p className="text-destructive">
									{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
									{(currentState?.errors as any)?.confirmPassword}
								</p>
							)}
							{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
							{isSignUp && (rhfErrors as any).confirmPassword?.message && (
								<p className="text-destructive">
									{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
									{(rhfErrors as any).confirmPassword?.message}
								</p>
							)}
						</label>
					</div>
				</Show>
				<Button
					type="submit"
					variant={"filled-primary"}
					className="flex items-center justify-center gap-2"
				>
					<span>{isSignUp ? "Sign up" : "Sign in"}</span>
				</Button>
				{currentState?.errors?.root && (
					<p className="text-destructive">{currentState?.errors?.root}</p>
				)}
				{rhfErrors.root?.message && (
					<p className="text-destructive">{rhfErrors.password?.message}</p>
				)}
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
