"use client";
import MenuDrawer, { type TNavigationItem } from "@/components/layout/menuDrawer";
import { CannabisIcon, SparklesIcon } from "lucide-react";

export const navigationItems: TNavigationItem[] = [
	{
		name: "Community",
		description: "Find your next mix.",
		href: "/dds1",
		Icon: SparklesIcon,
	},
	{
		name: "Crop Planner",
		description: "Plan your next crop.",
		href: "/dds1/cropplanner",
		Icon: CannabisIcon,
	},
	// {
	// 	name: "Mixer",
	// 	description: "Create your next mix",
	// 	href: "/dds1/mixer",
	// 	Icon: FlaskRoundIcon,
	// },
];

export default function DDS1MenuDrawer() {
	return <MenuDrawer navigationItems={navigationItems} />;
}
