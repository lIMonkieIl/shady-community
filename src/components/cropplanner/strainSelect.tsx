"use client";
import { useCropManager } from "@/hooks/useCropManager";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BREAKPOINTS } from "@/lib/constants/theme/Breakpoints";
import { cn } from "@/lib/utils/helpers";
import { use$, useObservable } from "@legendapp/state/react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "../shared/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../shared/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../shared/ui/select";

export default function SelectStrain() {
	const { selectedSeedIndex, selectedSeed, seeds, setSelectedSeedIndex } = useCropManager();
	const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.sm}px)`);
	const isOpen = useObservable(false);
	const open = use$(isOpen);

	const handleSelect = (value: string) => {
		setSelectedSeedIndex(Number.parseInt(value));
		isOpen.set(false);
	};

	if (isMobile) {
		return (
			<Drawer onClose={() => isOpen.set(false)} open={open}>
				<DrawerTrigger
					className={cn(
						"flex h-10 w-full items-center justify-between px-3 py-2 rounded-base text-sm data-[placeholder]:text-surface-950-50/70 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
						"preset-outlined-surface-200-800 focus:preset-outlined-primary-500 hover:preset-tonal",
						"theme-decorated",
					)}
					onClick={() => isOpen.set(true)}
				>
					<span className="capitalize">{selectedSeed.strain}</span>
					<ChevronDown className="h-4 w-4 text-primary-500 opacity-50" />
				</DrawerTrigger>
				<DrawerContent className="card preset-filled-surface-50-950 rounded-b-none max-h-[70vh]">
					<DrawerHeader>
						<DrawerTitle className="font-bold">Strains</DrawerTitle>
					</DrawerHeader>
					<div className="p-1 overflow-x-auto">
						{seeds.map((seed, index) => (
							<Button
								key={seed.strain}
								unstyled
								onClick={() => handleSelect(index.toString())}
								value={index.toString()}
								className={cn(
									"relative flex w-full cursor-default select-none items-center py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
									"capitalize hover:preset-tonal card",
								)}
							>
								{selectedSeedIndex === index && (
									<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
										<Check className="h-4 w-4 text-primary-300-700" />
									</span>
								)}
								<div className="flex justify-between items-center w-full gap-2">
									<div className=" flex flex-col grow items-start">
										<span className="font-bold capitalize truncate">{seed.strain}</span>
										<div className="font-light text-surface-500 text-sm">
											<span>environment: </span>
											<span className="text-primary-300-700 font-semibold">{seed.environment}</span>
										</div>
									</div>
									<div className="badge preset-filled-primary-400-600">
										<span className="font-light">price:</span>
										<span className="font-semibold">${seed.price}</span>
									</div>
								</div>
							</Button>
						))}
					</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Select
			value={selectedSeedIndex.toString()}
			onValueChange={handleSelect}
			open={open}
			onOpenChange={(value) => isOpen.set(value)}
		>
			<SelectTrigger className="btn w-full justify-between flex preset-outlined-surface-200-800 theme-decorated decorator-top-right focus:preset-outlined-primary-500 hover:preset-tonal">
				<span className="capitalize">{selectedSeed.strain}</span>
				<ChevronDown className="h-4 w-4 text-primary-500 opacity-50" />
			</SelectTrigger>
			<SelectContent
				className="card preset-filled-surface-50-950 preset-outlined-primary-50-950 overflow-y-auto"
				style={{ maxHeight: "min(50vh, 345px)" }}
			>
				<div className="pl-3 py-1 font-bold">
					<span>Strains</span>
				</div>
				{seeds.map((seed, index) => (
					<SelectItem
						key={seed.strain}
						value={index.toString()}
						className="capitalize hover:preset-tonal card"
					>
						{selectedSeedIndex === index && (
							<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
								<Check className="h-4 w-4 text-primary-300-700" />
							</span>
						)}
						<div className="flex justify-between items-center w-full gap-2">
							<div className=" flex flex-col grow items-start">
								<span className="font-bold capitalize truncate">{seed.strain}</span>
								<div className="font-light text-surface-500 text-sm">
									<span>environment: </span>
									<span className="text-primary-300-700 font-semibold">{seed.environment}</span>
								</div>
							</div>
							<div className="badge preset-filled-primary-400-600">
								<span className="font-light">price:</span>
								<span className="font-semibold">${seed.price}</span>
							</div>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
