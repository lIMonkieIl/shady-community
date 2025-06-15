"use client";

import { signInWithDiscordAction } from "@/actions/auth";
import Form from "@/components/shared/form";
import { SubmitButton } from "@/components/shared/ui/submitButton";
import { toast } from "@/components/toast/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { z } from "zod";

export default function DiscordSignInButton() {
	const {
		form: discordForm,
		action: { execute: discordExecute },
	} = useHookFormAction(signInWithDiscordAction, zodResolver(z.object({})), {
		actionProps: {
			// onSuccess: ({ data }) => {
			// 	toast({ type: "success", description: data?.success ?? "", title: "Success" });
			// },
			onError: ({ error }) => {
				toast({ title: "Error", description: error.serverError ?? "", variant: "tonal-error" });
			},
		},
	});
	return (
		<div className="flex w-full">
			<Form.Root form={discordForm} action={discordExecute} className="w-full">
				<SubmitButton variant={"outlined-primary"} className="w-full">
					<SiDiscord size={18} />
					<span>Sign in with Discord</span>
				</SubmitButton>
			</Form.Root>
		</div>
	);
}
