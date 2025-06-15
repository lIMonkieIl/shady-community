import ThemeSwitcher from "../theme/themeSwitcher";
import { MenuDrawerButton } from "./menuDrawerButton";

export default function Header() {
	return (
		<header className="sticky top-0 z-20 px-4 h-10 pt-4 flex items-center justify-between">
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
