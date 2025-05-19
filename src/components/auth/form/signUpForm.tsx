// usage example
"use client";

import { signUpAction } from "@/actions/auth";
import Form from "@/components/shared/form";
import { Button } from "@/components/shared/ui/button";
import { DividerWithText } from "@/components/shared/ui/dividerWithText";
import { Input } from "@/components/shared/ui/input";
import { SubmitButton } from "@/components/shared/ui/submitButton";
import { toast } from "@/components/toast/toast";
import { signUpSchema } from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Show, useObservable } from "@legendapp/state/react";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import Link from "next/link";
import DiscordSignInButton from "./discordSignInButton";

export default function SignUpForm() {
	const {
		form,
		action: { execute },
	} = useHookFormAction(signUpAction, zodResolver(signUpSchema), {
		actionProps: {
			onSuccess: ({ data }) => {
				toast({ type: "success", description: data?.success ?? "", title: "Success" });
			},
			onError: ({ error }) => {
				toast({ type: "error", description: error?.serverError ?? "", title: "Error" });
			},
		},
		formProps: {
			mode: "all",
			values: {
				email: "",
				password: "",
				confirmPassword: "",
			},
		},
	});

	const disabled = useObservable(true);

	return (
		<Show
			if={!disabled}
			else={
				<div className="card flex-col gap-4 preset-glass-warning p-3 flex-centered">
					<span>Auth is currently disabled</span>
					<Button variant={"filled-primary"} asChild>
						<Link href={"/"}>Got Home</Link>
					</Button>
				</div>
			}
		>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold">Create an account</h1>
					<p className="text-balance text-sm text-muted-foreground">
						Enter your email below to create your account
					</p>
				</div>
				<Form.Root form={form} action={execute} className="grid items-start gap-4">
					<Form.Field
						control={form.control}
						name="email"
						label="Email"
						render={({ field }) => <Input {...field} />}
					/>

					<Form.Field
						control={form.control}
						name="password"
						label="Password"
						render={({ field }) => <Input type="password" {...field} />}
					/>
					<Form.Field
						control={form.control}
						name="confirmPassword"
						label="Confirm Password"
						render={({ field }) => <Input type="password" {...field} />}
					/>
					<SubmitButton
						variant={"filled-primary"}
						className="flex items-center justify-center gap-2"
						pendingText={"Signing in..."}
					>
						Sign up
					</SubmitButton>
				</Form.Root>
				<DividerWithText>Or continue with</DividerWithText>
				<DiscordSignInButton />
				<div className="text-center  space-x-1 text-sm">
					<span>Already have an account?</span>
					<Button unstyled asChild>
						<Link className="anchor" href={"/auth/sign-in"}>
							Sign in
						</Link>
					</Button>
				</div>
			</div>
		</Show>
	);
}
