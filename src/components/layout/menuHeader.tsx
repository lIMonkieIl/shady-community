import ThemeSwitcher from "../theme/themeSwitcher";
import { MenuDrawerButton } from "./menuDrawerButton";

export default function Header() {
	return (
		<header className="sticky top-0 z-20 pt-4 h-10">
			<div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl flex items-center justify-between h-full">
				{/* Left content */}
				<div>
					<MenuDrawerButton />
				</div>

				{/* Right content */}
				<div className="flex items-center gap-2">
					<ThemeSwitcher />
				</div>
			</div>
		</header>
	);
}
