"use client";
import { MenuDrawerButton } from "./menuDrawerButton";
import ThemeSwitcher from "./themeSwitcherV1";

export default function Header() {
	return (
		<header className="sticky top-0 z-20 bg-surface-50-950 p-4 flex items-center justify-between">
			{/* Left content */}
			<div>
				<MenuDrawerButton />
			</div>

			<div className="flex items-center gap-2">
				<ThemeSwitcher />
			</div>
		</header>
	);
}
