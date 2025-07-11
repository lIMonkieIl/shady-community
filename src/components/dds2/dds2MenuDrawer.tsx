"use client";
import { NavigationDrawer, type TNavigationItem } from "@/components/layout/menuDrawer";

export const navigationItems: TNavigationItem[] = [];
export default function DDS2MenuDrawer() {
	return <NavigationDrawer navigationItems={navigationItems} />;
}
