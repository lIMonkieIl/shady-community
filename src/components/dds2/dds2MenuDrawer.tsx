"use client";
import MenuDrawer, { type TNavigationItem } from "@/components/layout/menuDrawer";

export const navigationItems: TNavigationItem[] = [];
export default function DDS2MenuDrawer() {
	return <MenuDrawer navigationItems={navigationItems} />;
}
