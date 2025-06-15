"use client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type * as React from "react";

import { BREAKPOINTS } from "@/lib/constants/theme/Breakpoints";
import type { TThemeDecoration, TThemeMode, TThemeName } from "@/lib/constants/theme/Themes";
import { cn } from "@/lib/utils/helpers";
import { observable } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";
import { ChevronDown, SwatchBook } from "lucide-react";
import { Moon as IconMoon } from "lucide-react";
import { Sun as IconSun } from "lucide-react";
import { Monitor as IconMonitor } from "lucide-react";
import { Button } from "../shared/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../shared/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "../shared/ui/popover";
import { useThemeManager } from "./themeManager";

const isOpen = observable(false);

export default function ThemeSwitcher() {
	const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.sm}px)`);
	const open = use$(isOpen);

	if (isMobile) {
		return (
			<Drawer onClose={() => isOpen.set(false)} open={open}>
				<DrawerTrigger onClick={isOpen.toggle} asChild>
					<TriggerButton />
				</DrawerTrigger>
				<DrawerContent className="card preset-filled-surface-50-950 rounded-b-none max-h-[70vh]">
					<DrawerHeader className="hidden">
						<DrawerTitle className="font-bold">Theme</DrawerTitle>
					</DrawerHeader>
					<div className="theme-decorated decorator-top-right right-4 -top-5" />
					<div className="p-4 space-y-2 flex-1 overflow-y-auto">
						<ThemeManagerSelector />
					</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Popover open={open} onOpenChange={(value) => isOpen.set(value)}>
			<PopoverTrigger asChild>
				<TriggerButton />
			</PopoverTrigger>
			<PopoverContent
				side="bottom"
				sideOffset={10}
				className="card mr-4 w-fit preset-filled-surface-50-950  preset-outlined-primary-50-950 overflow-hidden overflow-y-scroll p-3"
				style={{ maxHeight: "min(80vh, 600px)" }}
			>
				<div className="theme-decorated decorator-top-right " />
				<ThemeManagerSelector />
			</PopoverContent>
		</Popover>
	);
}

const TriggerButton = ({ className, ...props }: React.ComponentProps<"button">) => {
	return (
		<Button variant={"tonal"} className={cn("px-2 py-1.5", className)} {...props}>
			<SwatchBook className="size-4" />
			<span className="hidden md:inline text-sm">Theme</span>
			<ChevronDown className="h-4 w-4 text-primary-400-600" />
		</Button>
	);
};

const ThemeManagerSelector: React.FC = () => {
	const {
		currentThemeDecoration,
		currentThemeMode,
		currentThemeName,
		setTheme,
		themeDecorations,
		themeModes,
		themeNames,
	} = useThemeManager();
	const onThemeDecorationSelection = (decorationName: TThemeDecoration) => {
		setTheme({ decoration: decorationName });
	};

	const onThemeModeSelection = (mode: TThemeMode) => {
		setTheme({ mode: mode });
	};

	const getModeIcon = (mode: TThemeMode) => {
		switch (mode) {
			case "dark":
				return <IconMoon className="size-4" />;
			case "light":
				return <IconSun className="size-4" />;
			case "system":
				return <IconMonitor className="size-4" />;
		}
	};

	const onThemeNameSelection = (themeName: TThemeName) => {
		setTheme({ name: themeName });
	};
	return (
		<>
			<div className="p-2 flex space-y-2 flex-col">
				<span className="h6">
					Mode:
					<span className="capitalize text-xs badge preset-filled-tertiary-400-600">
						{currentThemeMode}
					</span>
				</span>
				<div className="w-full flex">
					<nav className="btn-group transition-all p-2">
						{themeModes.map((mode) => {
							return (
								<Button
									size={"sm"}
									variant={currentThemeMode === mode ? "outlined-primary" : "filled-primary"}
									className={"text-sm"}
									key={mode}
									onClick={() => onThemeModeSelection(mode)}
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
						{currentThemeDecoration}
					</span>
				</span>
				<div className="flex flex-wrap gap-2">
					{themeDecorations.map((decoration) => (
						<Button
							key={decoration.label}
							onClick={() => onThemeDecorationSelection(decoration.name)}
							variant={
								currentThemeDecoration === decoration.name ? "outlined-primary" : "filled-primary"
							}
							className={"relative w-fit btn text-sm"}
						>
							{/* Hanging source in top-left */}
							<div className="absolute -top-2 -left-2 shadow z-10">
								{decoration.source.endsWith(".svg") ? (
									<img src={decoration.source} alt={decoration.label} className="w-5 h-5" />
								) : (
									<span className="text-xs bg-transparent">{decoration.source}</span>
								)}
							</div>

							{/* Button content */}
							<span>{decoration.label}</span>
						</Button>
					))}
				</div>
			</div>
			<hr className="hr border-t-2 border-tertiary-400-600 rounded-container" />
			<div className="p-2 flex space-y-2 flex-col">
				<span className="h6">
					Theme:
					<span className="capitalize text-xs badge preset-filled-tertiary-400-600">
						{currentThemeName}
					</span>
				</span>
				<div className="flex flex-col p-2 gap-2">
					{themeNames.map((theme) => (
						<Button
							key={theme.name}
							unstyled
							data-theme={theme.name}
							className={
								"w-full btn p-3 bg-surface-400-600 rounded-md grid grid-cols-[auto_1fr_auto] items-center gap-4"
							}
							onClick={() => onThemeNameSelection(theme.name)}
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
		</>
	);
};
