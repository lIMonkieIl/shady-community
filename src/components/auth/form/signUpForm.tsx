// usage example
"use client";

import { signInWithDiscordAction, signUpAction } from "@/actions/auth";
import Form from "@/components/shared/form";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { SubmitButton } from "@/components/shared/ui/submitButton";
import { toast } from "@/components/toast/toast";
import { signUpSchema } from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import Link from "next/link";
import { z } from "zod";

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

	const {
		form: discordForm,
		action: { execute: discordExecute },
	} = useHookFormAction(signInWithDiscordAction, zodResolver(z.object({})), {
		actionProps: {
			// onSuccess: ({ data }) => {
			// 	toast({ type: "success", description: data?.success ?? "", title: "Success" });
			// },
			onError: ({ error }) => {
				toast({ title: "Error", description: error.serverError ?? "", type: "error" });
			},
		},
	});
	return (
		<div className="flex flex-col sm:max-w-[425px] w-full gap-3 card preset-tonal-surface p-5">
			<div className="flex flex-col items-center">
				<span className="h3">Sign Up</span>
				<span className="text-current/70">Sign up using your discord account</span>
			</div>
			<div className="flex w-full">
				<Form.Root form={discordForm} action={discordExecute} className="w-full">
					<SubmitButton variant={"filled-primary"} className="w-full">
						<span>Discord</span>
						<SiDiscord size={18} />
					</SubmitButton>
				</Form.Root>
			</div>
			<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border after:border-tertiary-400-600">
				<span className="relative z-10 bg-surface-50-950 px-2">
					<span className="text-tertiary-400-600">Or continue with</span>
				</span>
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
			<div className="text-center  space-x-1 text-sm">
				<span>Already have an account?</span>
				<Button unstyled asChild>
					<Link className="anchor" href={"/auth/sign-in"}>
						Sign in
					</Link>
				</Button>
			</div>
		</div>
	);
}
