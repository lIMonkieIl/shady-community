"use client";

import type { IIngredient } from "@/hooks/useIngredientsManager";
import { useMixManager } from "@/hooks/useMixManager";
import { type IMix, useMixesManager } from "@/hooks/useMixesManager";
import { cn, getColorForValue, isIngredient, isMixIngredient } from "@/lib/utils/helpers";
import { CircleHelpIcon, PlusIcon, TableOfContentsIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import MixIngredientCardInfo from "../mixer/mixIngredientCardInfo";
import { Button } from "./ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function IngredientCard({
	ingredient,
}: { ingredient: IIngredient | IMix | undefined }) {
	const {
		actions: { recipeAdd },
	} = useMixManager();

	const {
		actions: { removeMix },
	} = useMixesManager();
	const [hoverOpen, setHoverOpen] = useState(false);
	if (!ingredient) {
		return <div>Ingredient not found</div>;
	}

	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!open) return;

		const findScrollableParent = (startEl: HTMLElement | null): HTMLElement | null => {
			let el = startEl;
			while (el && el !== document.body) {
				const style = window.getComputedStyle(el);
				const overflowY = style.overflowY;
				if (overflowY === "auto" || overflowY === "scroll") {
					return el;
				}
				el = el.parentElement;
			}
			return null;
		};

		const node = document.querySelector("#ingredient-card") as HTMLElement;
		const scrollableParent = findScrollableParent(node);

		const handleScroll = () => setOpen(false);

		scrollableParent?.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			scrollableParent?.removeEventListener("scroll", handleScroll);
		};
	}, [open]);

	return (
		<div
			id="ingredient-card"
			className="card p-4 bg-surface-200-800/30 border-3 space-y-2 border-surface-500/50 grid grid-rows-[1fr_auto] h-full"
		>
			<div className="w-full">
				<div className="grid grid-cols-[1fr_auto] gap-2">
					{/* Data */}
					<div className="min-w-0 flex-1">
						<div className="w-full flex justify-between items-center gap-2">
							<span
								className="h6 capitalize block text-ellipsis overflow-hidden whitespace-nowrap min-w-0 flex-1"
								title={ingredient.name}
							>
								{ingredient.name}
							</span>
							{isMixIngredient(ingredient) && (
								<span className="badge font-semibold w-fit preset-tonal-primary shrink-0">
									{ingredient.visibility}
								</span>
							)}
						</div>
						<div className="w-full">
							<div className="flex gap-2 justify-start items-center">
								<span>Stats:</span>
								<HoverCard open={hoverOpen} onOpenChange={setHoverOpen} openDelay={10}>
									<HoverCardTrigger onClick={() => setHoverOpen(true)} className="cursor-help">
										<CircleHelpIcon size={18} />
									</HoverCardTrigger>
									<HoverCardContent
										side="right"
										align="start"
										className="w-50 card preset-tonal-surface  border-surface-500/50 border-2 p-2"
									>
										<span className="h6">Stats Key:</span>
										<div className="flex flex-col space-y-3 p-2">
											<Label className={cn("badge w-full", getColorForValue(0.1))}>
												very Low: 0.1
											</Label>
											<Label className={cn("badge w-full", getColorForValue(1.1))}>Low: 1.1</Label>
											<Label className={cn("badge w-full", getColorForValue(2.1))}>
												Medium: 2.1
											</Label>
											<Label className={cn("badge w-full", getColorForValue(3.1))}>High: 3.1</Label>
											<Label className={cn("badge w-full", getColorForValue(4.1))}>
												very high: 4.1
											</Label>
											<Label className={cn("badge w-full", getColorForValue(6.1))}>
												Danger: 6.1
											</Label>
											<Label className={cn("badge w-full", getColorForValue(10.1))}>
												Deadly: 10.1
											</Label>
										</div>
									</HoverCardContent>
								</HoverCard>
							</div>
							<div className=" gap-2 grid grid-cols-2 w-full justify-evenly">
								<Label className={cn("badge w-full", getColorForValue(ingredient.toxicity))}>
									Tox: {ingredient.toxicity}
								</Label>
								<Label className={cn("badge w-full", getColorForValue(ingredient.strength))}>
									Str: {ingredient.strength}
								</Label>
								<Label
									className={cn("badge w-full", getColorForValue(ingredient.mix_strengthening))}
								>
									MixStr: {ingredient.mix_strengthening}
								</Label>
								<Label className={cn("badge w-full", getColorForValue(ingredient.addictiveness))}>
									Addict: {ingredient.addictiveness}
								</Label>
							</div>
						</div>
					</div>
					{/* image */}
					<div className="flex justify-center items-center shrink-0">
						<div className="card flex justify-between items-center preset-tonal-surface w-full h-fit overflow-hidden">
							<Avatar className="w-18 h-18 rounded-none">
								<AvatarImage
									src={
										ingredient.image?.startsWith("https:")
											? ingredient.image
											: `/images/${ingredient.image}`
									}
									alt={`${ingredient.name} image`}
								/>
								<AvatarFallback className="text-center">{ingredient.name} image</AvatarFallback>
							</Avatar>
						</div>
						{/* <Image
								src={
									ingredient.image?.startsWith("https:")
										? ingredient.image
										: `/images/${ingredient.image}`
								}
								alt={`${ingredient.category} image`}
							/> */}
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<MixIngredientCardInfo size="base" ingredientId={ingredient.id} />

				<div className="space-x-2">
					{!isIngredient(ingredient) && (
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button size={"sm"} variant={"tonal-secondary"}>
									<TableOfContentsIcon />
									Actions
								</Button>
							</PopoverTrigger>
							<PopoverContent
								side="top"
								className="card w-fit preset-filled-surface-50-950 preset-outlined-primary-50-950 overflow-hidden overflow-y-scroll"
							>
								<div className="theme-decorated decorator-top-right " />
								<div className="flex flex-col p-2 gap-2">
									<Button
										onClick={() => removeMix(ingredient.id)}
										size={"sm"}
										variant={"tonal-error"}
									>
										<TrashIcon />
										Delete
									</Button>
								</div>
							</PopoverContent>
						</Popover>
					)}

					<Button
						size={"sm"}
						onClick={() => recipeAdd(ingredient.id)}
						disabled={ingredient.category === "Mix"}
						variant={"tonal-success"}
					>
						<PlusIcon />
						Add
					</Button>
				</div>
			</div>
		</div>
	);
}
