"use client";

import { signOutAction } from "@/actions/auth";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BREAKPOINTS } from "@/lib/constants/theme/Breakpoints";
import { uiState$ } from "@/lib/state/local/uiState";
import { zodResolver } from "@hookform/resolvers/zod";
import { use$ } from "@legendapp/state/react";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Cannabis, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { z } from "zod";
import { getInitials } from "../../lib/utils/helpers";
import { useAuth } from "../auth/authProvider";
import WordCommunitySVG from "../logos/WordCommunity";
import WordShadySVG from "../logos/WordShady";
import Form from "../shared/form";
import { Avatar, AvatarFallback, AvatarImage } from "../shared/ui/avatar";
import { Button } from "../shared/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "../shared/ui/drawer";
import { SubmitButton } from "../shared/ui/submitButton";
import { toast } from "../toast/toast";
const navigationItems = [
	{
		name: "Community",
		description: "Find your next mix.",
		href: "/",
		Icon: Sparkles,
	},
	{
		name: "Crop Planner",
		description: "Plan your next crop.",
		href: "/cropplanner",
		Icon: Cannabis,
	},
];

export default function NavigationDrawer() {
	const open = use$(uiState$.drawer.isOpen);
	const { profile: profileState } = useAuth();
	const profile = use$(profileState);
	const pathname = usePathname();
	const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.sm}px)`);
	// Set direction and styles based on screen size
	const direction = isMobile ? "bottom" : "left";
	const contentClassName = isMobile
		? "bottom-0 fixed  bg-surface-50-950 left-0 h-[60%] right-0 outline-none flex"
		: "top-0 bottom-0  bg-surface-50-950 fixed outline-none  w-[300px] flex";
	const innerDivClassName = isMobile
		? "h-full w-full  grow flex flex-col rounded-tr-container rounded-tl-container"
		: "h-full w-full grow flex flex-col rounded-tr-container rounded-br-container;";

	// Height for mobile drawer
	const mobileDrawerHeight = isMobile ? "h-[70vh]" : "h-full";
	const {
		form,
		action: { execute },
	} = useHookFormAction(signOutAction, zodResolver(z.object({})), {
		actionProps: {
			onSuccess: ({ data }) => {
				toast({ type: "success", description: data?.success ?? "", title: "Success" });
			},
			onError: ({ error }) => {
				toast({ title: "Error", description: error.serverError ?? "", type: "error" });
			},
		},
	});
	return (
		<aside>
			<Drawer open={open} onClose={uiState$.drawer.close} direction={direction}>
				<DrawerContent
					className={contentClassName}
					style={
						{
							"--initial-transform": "calc(100% + 8px)",
						} as React.CSSProperties
					}
				>
					<div className={`${innerDivClassName} ${mobileDrawerHeight}`}>
						<div className="p-4 border-b border-primary-50-950">
							<DrawerTitle hidden className="font-medium  text-xl">
								Menu
							</DrawerTitle>
							<WordShadySVG className="dark:fill-white/50 fill-black/50 right-3 -rotate-3 relative h-10 top-1 stroke-primary-950-50 " />
							<WordCommunitySVG className="dark:fill-white/50 fill-black/50 rotate-2 relative h-8 bottom-1 stroke-primary-950-50 " />
						</div>

						{/* Navigation Items */}
						<nav className="px-3 py-2 flex-1 overflow-y-auto">
							<ul className="space-y-1">
								{navigationItems.map(({ Icon, ...item }) => {
									const isActive = pathname === item.href;
									return (
										<li key={item.name}>
											<Link
												href={item.href}
												onClick={() => {
													uiState$.drawer.close();
												}}
												className={`btn w-full items-center justify-start font-medium ${
													isActive ? "preset-filled-primary-400-600" : "btn preset-tonal-surface"
												}`}
											>
												<Icon className="mr-3" />
												<div className="flex flex-col">
													<span className=" font-semibold">{item.name}</span>
													<span className="text-xs font-light">{item.description}</span>
												</div>
											</Link>
										</li>
									);
								})}
							</ul>
						</nav>

						<div className="p-4 border-t border-primary-50-950">
							{profile ? (
								<div className="flex items-center">
									{/* <Avatar
										background="bg-secondary-400-600"
										base="decorator-top-right theme-decorated w-10 h-10"
										src={profile.avatar_url ?? undefined}
										name={profile.username ?? "sc"}
									/> */}
									<div className="theme-decorated decorator-top-right">
										<Avatar className="size-10">
											<AvatarImage
												className="theme-decorated"
												src={profile.avatar_url ?? undefined}
											/>
											<AvatarFallback className="bg-secondary-400-600">
												{getInitials(profile.username)}
											</AvatarFallback>
										</Avatar>
									</div>
									<div className="ml-3">
										<p className="text-sm font-medium">{profile.username}</p>
										<Form.Root form={form} action={execute}>
											<SubmitButton variant="tonal-error" size="sm" showLoadingIcon={true}>
												Sign out
											</SubmitButton>
										</Form.Root>
									</div>
								</div>
							) : (
								<div className="relative w-full">
									<Button
										onClick={() => uiState$.drawer.close()}
										variant={"filled-secondary"}
										className=" w-full"
										disabled
										asChild
									>
										<Link href={"/auth/sign-in"}>Sign In / Register</Link>
									</Button>
									<div className="absolute top-0 left-0 font-semibold animate-bounce -rotate-12 chip preset-filled">
										Soon
									</div>
								</div>
							)}
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		</aside>
	);
}
