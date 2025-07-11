import { useIngredientsManager } from "@/hooks/useIngredientsManager";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BREAKPOINTS } from "@/lib/constants/theme/Breakpoints";
import { Show, use$ } from "@legendapp/state/react";
import { useObservable } from "@legendapp/state/react";
import { CircleHelpIcon, InfoIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn, formatUSD, getColorForValue, isIngredient } from "../../lib/utils/helpers";
import { Button } from "../shared/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../shared/ui/drawer";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../shared/ui/hover-card";
import { Label } from "../shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../shared/ui/popover";

export default function MixIngredientCardInfo({
	ingredientId,
	size,
}: { ingredientId: string; size: "sm" | "base" }) {
	const {
		actions: { getIngredientById },
	} = useIngredientsManager();
	const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.sm}px)`);
	const isOpen = useObservable(false);
	const open = use$(isOpen);
	const ingredient = getIngredientById(ingredientId);
	if (!ingredient) {
		return <div>Ingredient not found</div>;
	}
	return (
		<Show
			if={isMobile}
			else={
				<Popover open={open} onOpenChange={isOpen.set}>
					<PopoverTrigger asChild>
						<Button className="p-1.5" size={size === "sm" ? "icon" : "sm"} variant="tonal-tertiary">
							<InfoIcon />
							{size === "base" && <span>Info</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent
						side="right"
						sideOffset={12}
						className="mt-12 card preset-tonal-surface border-3 border-surface-500/50 p-4"
					>
						<IngredientInfo ingredientId={ingredient.id} />
					</PopoverContent>
				</Popover>
			}
		>
			<Drawer onClose={() => isOpen.set(false)} open={open}>
				<DrawerTrigger asChild onClick={() => isOpen.set(true)}>
					<Button size={size === "sm" ? "icon" : "sm"} className="p-1.5" variant="tonal-tertiary">
						<InfoIcon />
						{size === "base" && <span>Info</span>}
					</Button>
				</DrawerTrigger>
				<DrawerContent className="card preset-filled-surface-50-950 rounded-b-none max-h-[70vh]">
					<DrawerHeader>
						<DrawerTitle className="h6">About {ingredient.name}</DrawerTitle>
					</DrawerHeader>
					<div className="px-4 pb-4">
						<IngredientInfo ingredientId={ingredient.id} />
					</div>
				</DrawerContent>
			</Drawer>
		</Show>
	);
}

function IngredientInfo({ ingredientId }: { ingredientId: string }) {
	const {
		actions: {
			getIngredientById,
			getIngredientPurchasesByIngredientId,
			getIngredientDemandsByIngredientId,
			getIngredientSellPriceByIngredientId,
		},
	} = useIngredientsManager();
	const ingredient = getIngredientById(ingredientId);
	const purchaseOptions = getIngredientPurchasesByIngredientId(ingredientId);
	const demand = getIngredientDemandsByIngredientId(ingredientId);
	const sellPrices = getIngredientSellPriceByIngredientId(ingredientId);

	if (!ingredient) {
		return <div>Not all data found</div>;
	}

	const minPurchasePrice: number | undefined = purchaseOptions
		? Math.min(...purchaseOptions.map((option) => option.price))
		: undefined;

	const maxPurchasePrice: number | undefined = purchaseOptions
		? Math.max(...purchaseOptions.map((option) => option.price))
		: undefined;
	const uniqueSectors = Array.from(new Set(demand?.map((d) => d.sector)));
	const [open, setOpen] = useState(false);
	return (
		<div className="grid gap-4">
			<div className="w-full flex gap-4 items-center justify-between">
				<div className="w-full">
					<div className="flex gap-2 justify-start items-center">
						<span>Stats:</span>
						<HoverCard open={open} onOpenChange={setOpen} openDelay={10}>
							<HoverCardTrigger onClick={() => setOpen(true)} className="cursor-help">
								<CircleHelpIcon size={18} />
							</HoverCardTrigger>
							<HoverCardContent
								side="right"
								align="start"
								className="w-50 card preset-tonal-surface  border-surface-500/50 border-2 p-2"
							>
								<span className="h6">Stats Key:</span>
								<div className="flex flex-col space-y-3 p-2">
									<Label className={cn("badge w-full", getColorForValue(0.1))}>very Low: 0.1</Label>
									<Label className={cn("badge w-full", getColorForValue(1.1))}>Low: 1.1</Label>
									<Label className={cn("badge w-full", getColorForValue(2.1))}>Medium: 2.1</Label>
									<Label className={cn("badge w-full", getColorForValue(3.1))}>High: 3.1</Label>
									<Label className={cn("badge w-full", getColorForValue(4.1))}>
										very high: 4.1
									</Label>
									<Label className={cn("badge w-full", getColorForValue(6.1))}>Danger: 6.1</Label>
									<Label className={cn("badge w-full", getColorForValue(10.1))}>Deadly: 10.1</Label>
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
						<Label className={cn("badge w-full", getColorForValue(ingredient.mix_strengthening))}>
							MixStr: {ingredient.mix_strengthening}
						</Label>
						<Label className={cn("badge w-full", getColorForValue(ingredient.addictiveness))}>
							Addict: {ingredient.addictiveness}
						</Label>
					</div>
				</div>

				<div className="card preset-tonal shrink-0 overflow-hidden">
					<Image
						width={75}
						height={75}
						src={
							ingredient.image?.startsWith("https:")
								? ingredient.image
								: `/images/${ingredient.image}`
						}
						alt={`${ingredient.category} image`}
					/>
				</div>
			</div>
			<div className="flex flex-col space-y-2">
				<div className="flex justify-between">
					<Label className="flex flex-col gap-2 items-start">
						Category:
						<span>{ingredient.category}</span>
					</Label>
					{isIngredient(ingredient) && (
						<Label className="flex flex-col gap-2 items-start">
							Type:
							<span>{ingredient.type}</span>
						</Label>
					)}
					<Label className="flex flex-col gap-2 items-start">
						Demand in sectors:
						<span>{uniqueSectors.join(", ")}</span>
					</Label>
				</div>
				<div className="flex justify-between">
					{sellPrices && (
						<Label className="flex flex-col gap-2 items-start">
							Average Selling Price:
							<span>
								{formatUSD(sellPrices.min_price)} - {formatUSD(sellPrices.max_price)}
							</span>
						</Label>
					)}
					<Label className="flex flex-col gap-2 items-start">
						Purchase/Production Price:
						<span>
							{formatUSD(minPurchasePrice ?? 0)} - {formatUSD(maxPurchasePrice ?? 0)}
						</span>
					</Label>
				</div>

				<Label className="flex flex-col gap-2 items-start">
					Description:
					<span>{ingredient.description}</span>
				</Label>
				<Show if={ingredient.information}>
					<Label className="flex flex-col gap-2 items-start">
						Information:
						<span>{ingredient.information}</span>
					</Label>
				</Show>
			</div>
		</div>
	);
}
