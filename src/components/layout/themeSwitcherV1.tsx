"use client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Accents, type TAccentName } from "@/lib/constants/theme/Accents";
import { BREAKPOINTS } from "@/lib/constants/theme/Breakpoints";
import { type TThemeMode, type TThemeName, ThemeModes, Themes } from "@/lib/constants/theme/Themes";
import { uiState$ } from "@/lib/state/local/uiState";
import { cn } from "@/lib/utils/helpers";
import { use$, useObservable } from "@legendapp/state/react";
import { ChevronDown, SwatchBook } from "lucide-react";
import { Moon as IconMoon } from "lucide-react";
import { Sun as IconSun } from "lucide-react";
import { Monitor as IconMonitor } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../ui/select";
export default function SelectStrain() {
	const curTheme = use$(uiState$.theme.current);
	const curAccent = use$(uiState$.theme.accent);

	const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.sm}px)`);
	const isOpen = useObservable(false);
	const open = use$(isOpen);
	const onSelection = (themeName: TThemeName) => {
		uiState$.theme.setTheme(themeName);

		document.body.classList.add("transition-all");
		document.body.classList.add("duration-500");

		document.documentElement.setAttribute("data-theme", themeName);

		setTimeout(() => {
			document.body.classList.remove("transition-all");
			document.body.classList.remove("duration-500");
		}, 200);

		//isOpen.set(false);
	};
	const onDecorationSelection = (accentName: TAccentName) => {
		uiState$.theme.setAccent(accentName);

		document.body.classList.add("transition-all");
		document.body.classList.add("duration-500");

		document.documentElement.setAttribute("data-decorator", accentName);

		setTimeout(() => {
			document.body.classList.remove("transition-all");
			document.body.classList.remove("duration-500");
		}, 200);

		//isOpen.set(false);
	};
	const curMode = use$(uiState$.theme.mode);

	// Add system mode detection
	useEffect(() => {
		const checkSystemMode = () => {
			if (curMode === "system") {
				const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
				document.documentElement.setAttribute("data-mode", isDark ? "dark" : "light");
			}
		};

		// Initial check
		checkSystemMode();

		// Add event listener for system theme changes
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		mediaQuery.addEventListener("change", checkSystemMode);

		// Cleanup
		return () => mediaQuery.removeEventListener("change", checkSystemMode);
	}, [curMode]);

	const onModeSelection = (mode: TThemeMode) => {
		uiState$.theme.setMode(mode);

		document.body.classList.add("transition-all");
		document.body.classList.add("duration-500");

		if (mode === "system") {
			const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			document.documentElement.setAttribute("data-mode", isDark ? "dark" : "light");
		} else {
			document.documentElement.setAttribute("data-mode", mode);
		}

		setTimeout(() => {
			document.body.classList.remove("transition-all");
			document.body.classList.remove("duration-500");
		}, 200);
	};

	const getModeIcon = (mode: TThemeMode) => {
		switch (mode) {
			case "dark":
				return <IconMoon className=" size-4" />;
			case "light":
				return <IconSun className=" size-4" />;
			case "system":
				return <IconMonitor className=" size-4" />;
		}
	};
	if (isMobile) {
		return (
			<Drawer onClose={() => isOpen.set(false)} open={open}>
				<DrawerTrigger
					className={cn("btn flex justify-between items-center preset-tonal gap-1")}
					onClick={() => isOpen.set(true)}
				>
					<span className="capitalize">
						<SwatchBook className="size-4" />
					</span>
					<ChevronDown className="h-4 w-4 text-primary-500 opacity-50" />
				</DrawerTrigger>
				<DrawerContent className="card preset-filled-surface-50-950 rounded-b-none max-h-[70vh]">
					<DrawerHeader className="hidden">
						<DrawerTitle className="font-bold">Theme</DrawerTitle>
					</DrawerHeader>
					<div className="theme-decorated left-2" />
					<div className="p-4 space-y-2 flex-1 overflow-y-auto">
						<div className="p-2 flex space-y-2 flex-col">
							<span className="h6">
								Mode:
								<span className="capitalize text-xs badge preset-filled-tertiary-400-600">
									{curMode}
								</span>
							</span>
							<div className="w-full flex">
								<nav className="btn-group transition-all p-2">
									{Object.values(ThemeModes).map((mode) => {
										return (
											<Button
												size={"sm"}
												variant={curMode === mode ? "outlined-primary" : "filled-primary"}
												className={"text-sm"}
												key={mode}
												onClick={() => onModeSelection(mode)}
											>
												<span className="capitalize">{mode}</span>
												{getModeIcon(mode)}
											</Button>
										);
									})}
								</nav>
							</div>
						</div>
						<hr className="hr border-t-2 border-tertiary-400-600 rounded-container" />
						<div className="p-2 flex space-y-2 flex-col">
							<span className="h6">
								Decoration:
								<span className="capitalize text-xs badge preset-filled-tertiary-400-600">
									{curAccent}
								</span>
							</span>
							<div className="flex flex-wrap gap-2">
								{Accents.map((accent) => (
									<Button
										key={accent.label}
										onClick={() => onDecorationSelection(accent.name)}
										variant={curAccent === accent.name ? "outlined-primary" : "filled-primary"}
										className={"relative w-fit btn text-sm"}
									>
										{/* Hanging source in top-left */}
										<div className="absolute -top-2 -left-2 shadow z-10">
											{accent.source.endsWith(".svg") ? (
												<img src={accent.source} alt={accent.label} className="w-5 h-5" />
											) : (
												<span className="text-xs bg-transparent">{accent.source}</span>
											)}
										</div>

										{/* Button content */}
										<span>{accent.label}</span>
									</Button>
								))}
							</div>
						</div>
						<hr className="hr border-t-2 border-tertiary-400-600 rounded-container" />
						<div className="p-2 flex space-y-2 flex-col">
							<span className="h6">
								Theme:
								<span className="capitalize text-xs badge preset-filled-tertiary-400-600">
									{curTheme}
								</span>
							</span>
							<div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
								{Themes.map((theme) => (
									<Button
										key={theme.name}
										unstyled
										data-theme={theme.name}
										className={
											"w-full btn p-3 bg-surface-400-600 rounded-md grid grid-cols-[auto_1fr_auto] items-center gap-4"
										}
										onClick={() => onSelection(theme.name)}
									>
										<span>{theme.emoji}</span>
										<h3 className="text-sm capitalize font-bold text-left">{theme.name}</h3>
										<div className="flex justify-center items-center -space-x-1.5">
											<div className="aspect-square w-4 bg-primary-500 border-[1px] border-black/10 rounded-full" />
											<div className="aspect-square w-4 bg-secondary-500 border-[1px] border-black/10 rounded-full" />
											<div className="aspect-square w-4 bg-tertiary-500 border-[1px] border-black/10 rounded-full" />
										</div>
									</Button>
								))}
							</div>
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Select
			value={curTheme}
			onValueChange={onSelection}
			open={open}
			onOpenChange={(value) => isOpen.set(value)}
		>
			<SelectTrigger className="px-3 xl:py-1.5 py-1 h-fit flex justify-between items-center preset-tonal gap-1">
				<SelectValue aria-label={curTheme}>
					<span className=" capitalize">
						<SwatchBook className="xl:hidden size-4" />
						<span className="hidden xl:inline">Theme</span>
					</span>
				</SelectValue>
			</SelectTrigger>
			<SelectContent
				className="card preset-filled-surface-50-950 theme-decorated preset-outlined-primary-50-950 "
				style={{ maxHeight: "min(80vh, 600px)" }}
			>
				<div className="p-2 flex space-y-2 flex-col">
					<span className="h6">
						Mode:
						<span className="capitalize text-xs badge preset-filled-tertiary-400-600">
							{curMode}
						</span>
					</span>
					<div className="w-full flex">
						<nav className="btn-group transition-all p-2">
							{Object.values(ThemeModes).map((mode) => {
								return (
									<Button
										size={"sm"}
										variant={curMode === mode ? "outlined-primary" : "filled-primary"}
										className={"text-sm"}
										key={mode}
										onClick={() => onModeSelection(mode)}
									>
										<span className="capitalize">{mode}</span>
										{getModeIcon(mode)}
									</Button>
								);
							})}
						</nav>
					</div>
				</div>
				<hr className="hr border-t-2 border-tertiary-400-600 rounded-container" />
				<div className="p-2 flex space-y-2 flex-col">
					<span className="h6">
						Decoration:
						<span className="capitalize text-xs badge preset-filled-tertiary-400-600">
							{curAccent}
						</span>
					</span>
					<div className="flex flex-wrap gap-2">
						{Accents.map((accent) => (
							<Button
								key={accent.label}
								onClick={() => onDecorationSelection(accent.name)}
								variant={curAccent === accent.name ? "outlined-primary" : "filled-primary"}
								className={"relative w-fit btn text-sm"}
							>
								{/* Hanging source in top-left */}
								<div className="absolute -top-2 -left-2 shadow z-10">
									{accent.source.endsWith(".svg") ? (
										<img src={accent.source} alt={accent.label} className="w-5 h-5" />
									) : (
										<span className="text-xs bg-transparent">{accent.source}</span>
									)}
								</div>

								{/* Button content */}
								<span>{accent.label}</span>
							</Button>
						))}
					</div>
				</div>
				<hr className="hr border-t-2 border-tertiary-400-600 rounded-container" />
				<div className="p-2 flex space-y-2 flex-col">
					<span className="h6">
						Theme:
						<span className="capitalize text-xs badge preset-filled-tertiary-400-600">
							{curTheme}
						</span>
					</span>
					<div className="flex flex-col p-2 gap-2">
						{Themes.map((theme) => (
							<Button
								key={theme.name}
								unstyled
								data-theme={theme.name}
								className={
									"w-full btn p-3 bg-surface-400-600 rounded-md grid grid-cols-[auto_1fr_auto] items-center gap-4"
								}
								onClick={() => onSelection(theme.name)}
							>
								<span>{theme.emoji}</span>
								<h3 className="text-sm capitalize font-bold text-left">{theme.name}</h3>
								<div className="flex justify-center items-center -space-x-1.5">
									<div className="aspect-square w-4 bg-primary-500 border-[1px] border-black/10 rounded-full" />
									<div className="aspect-square w-4 bg-secondary-500 border-[1px] border-black/10 rounded-full" />
									<div className="aspect-square w-4 bg-tertiary-500 border-[1px] border-black/10 rounded-full" />
								</div>
							</Button>
						))}
					</div>
				</div>
			</SelectContent>
		</Select>
	);
}
