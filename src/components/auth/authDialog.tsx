"use client";

import { signInAction, signUpAction } from "@/app/actions";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { useDialogFromUrl } from "@/hooks/useDialogFromUrl";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { signInSchema, signUpSchema } from "@/lib/schemas/auth";
import { authState$ } from "@/lib/state/local/authState";
import { uiState$ } from "@/lib/state/local/uiState";
import { cn } from "@/lib/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { observable } from "@legendapp/state";
import { Show, use$, useObservable } from "@legendapp/state/react";
import {
	startTransition,
	useActionState,
	useEffect,
	useRef,
	useState,
} from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "../ui/button";

const signUp = observable(false);

export function AuthDialog() {
	const [open, setOpen] = useDialogFromUrl("auth");
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const isSignUp = use$(signUp);
	if (isDesktop) {
		return (
			<Dialog
				open={open}
				onOpenChange={(open) => {
					setOpen(open);
				}}
			>
				<DialogContent className="w-full  card preset-filled-surface-50-950 border-0">
					<DialogHeader className="">
						<DialogTitle className="h2 text-center capitalize">
							{isSignUp ? "sign up" : "welcome back"}
						</DialogTitle>
						<DialogDescription className="text-center">
							{isSignUp
								? "Sign up with your Discord account"
								: "Sign in with your Discord account"}
						</DialogDescription>
					</DialogHeader>
					<AuthForm className="p-4" isDesktop={isDesktop} />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={(open) => setOpen(open)} modal={true}>
			<DrawerContent className="card rounded-b-none h-[70vh] preset-filled-surface-50-950 min-h-fit">
				<DrawerHeader className="text-center">
					<DrawerTitle className="capitalize h2">
						{isSignUp ? "sign up" : "welcome back"}
					</DrawerTitle>
					<DrawerDescription className="opacity-60">
						{isSignUp
							? "Sigin up with your Discord account"
							: "Sigin in with your Discord account"}
					</DrawerDescription>
				</DrawerHeader>
				<AuthForm className="pb-6 px-10 flex flex-col" isDesktop={isDesktop} />
			</DrawerContent>
		</Drawer>
	);
}

interface AuthFormProps extends React.ComponentProps<"div"> {
	isDesktop: boolean;
}

function AuthForm({ className, isDesktop, ...props }: AuthFormProps) {
	const isSignUp = use$(signUp);
	const [isLoading, setIsLoading] = useState(false);
	const [signInFormState, signInFormAction] = useActionState(signInAction, {
		success: false,
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
		formState: { errors: rhfErrors, isSubmitSuccessful },
	} = useForm<z.infer<typeof currentSchema>>({
		resolver: zodResolver(currentSchema),
		defaultValues: {
			...(currentState?.fields ?? {}),
		} as z.infer<typeof currentSchema>,
		mode: "onTouched",
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
		<form
			ref={formRef}
			action={currentAction}
			onSubmit={(evt) => {
				setIsLoading(true);
				evt.preventDefault();
				handleSubmit(() => {
					startTransition(() =>
						currentAction(
							new FormData(formRef.current ? formRef.current : undefined),
						),
					);
				})(evt);
				setIsLoading(false);
			}}
			className={cn("grid items-start gap-4", className)}
		>
			<div className="flex flex-col w-full gap-6">
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

				<div className="grid gap-2">
					<label htmlFor="email" className="label">
						<span className="label-text">Email</span>
						<input
							required
							id="email"
							className="input"
							type="email"
							{...register("email")}
						/>
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
							<p className="text-destructive">
								{currentState?.errors?.password}
							</p>
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
					disabled={isLoading}
					variant={"filled-primary"}
					className="flex items-center justify-center gap-2"
				>
					{isLoading ? (
						<>
							<svg
								className="w-4 h-4 animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<title>hello</title>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
								/>
							</svg>
							<span>Loading...</span>
						</>
					) : (
						<span>{isSignUp ? "Sign up" : "Sign in"}</span>
					)}
				</Button>
				{currentState?.errors?.root && (
					<p className="text-destructive">{currentState?.errors?.root}</p>
				)}
				{rhfErrors.root?.message && (
					<p className="text-destructive">{rhfErrors.password?.message}</p>
				)}
				<div className="text-center text-sm">
					{isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
					<Button unstyled onClick={() => signUp.toggle()} className="anchor">
						{isSignUp ? "Sign in" : "Sign up"}
					</Button>
				</div>
			</div>
		</form>
	);
}
