"use client";

import { Input } from "@/components/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/shared/ui/select";

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/shared/ui/context-menu";
import { useIngredientsManager } from "@/hooks/useIngredientsManager";
import { useMixManager } from "@/hooks/useMixManager";
import { cn, isIngredient } from "@/lib/utils/helpers";
import { formatUSD } from "@/lib/utils/helpers";
import { use$, useObservable, useObserveEffect } from "@legendapp/state/react";
import { ChevronDownIcon, MoveDownIcon, MoveUpIcon, StarIcon, Trash2Icon } from "lucide-react";
import { useMixesManager } from "../../hooks/useMixesManager";
import { formatWeight } from "../../lib/utils/helpers";
import MixIngredientCardInfo from "./mixIngredientCardInfo";

export default function MixIngredientCard({
	isMain,
	isLast,
	ingredientId,
	index,
}: { isMain?: boolean; isLast?: boolean; ingredientId: string; index: number }) {
	const {
		actions: {
			getIngredientPurity,
			setRecipeIngredientAmount,
			setRecipeMainIngredient,
			moveUpRecipeIngredient,
			moveDownRecipeIngredient,
			recipeRemove,
			clearRecipe,
		},
		state: { currentMixData },
	} = useMixManager();
	const {
		actions: { getIngredientById },
	} = useIngredientsManager();
	const recipe = currentMixData.recipe;
	const totalVolume = currentMixData.totalVolume;
	const ingredient = getIngredientById(ingredientId);
	if (!ingredient) {
		return <div>ingredient not found</div>;
	}
	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>
				<div
					className={cn(
						"card h-fit w-fit bg-surface-200-800/30 border-3 flex",
						isMain ? "border-primary-400-600 border-4" : "border-surface-500/50",
					)}
				>
					<div className="p-4 space-y-2">
						<div className="flex gap-4 justify-between">
							<p className="h6 ">{ingredient.name}</p>
							<MixIngredientCardInfo size="sm" ingredientId={ingredient.id} />
						</div>
						<div className="flex justify-between">
							<span className="badge preset-tonal-primary">
								Percent: {getIngredientPurity(recipe[index].amount, totalVolume)}%
							</span>
							<span className="badge preset-tonal-primary">
								Price: {formatUSD(recipe[index].totalPrice)}
							</span>
						</div>
						<div className="grid grid-cols-[2fr_1fr] gap-4">
							{ingredient &&
							(ingredient.category.toLowerCase() === "mix" ||
								ingredient.category.toLowerCase() === "pre-mix") ? (
								<div>
									<span className="text-nowrap text-sm">Recipe:</span>
									<RecipeShow ingredientId={ingredient.id} />
								</div>
							) : (
								ingredient && (
									<div>
										<span className="text-nowrap text-sm">Purchase from:</span>
										<PurchaseSelect index={index} ingredientId={ingredient.id} />
									</div>
								)
							)}

							<div>
								<span className="text-sm text-nowrap">Grams:</span>
								<Input
									disabled={isIngredient(ingredient) ? ingredient.type === "Liquid" : false}
									type="number"
									className="disabled:cursor-not-allowed"
									onFocus={(event) => {
										event.currentTarget.select();
									}}
									value={recipe[index].amount}
									onChange={(event) =>
										setRecipeIngredientAmount(
											ingredientId,
											Number.parseInt(event.currentTarget.value),
										)
									}
								/>
							</div>
						</div>
					</div>
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent className="card preset-filled-surface-50-950 border border-tertiary-400-600">
				{!isMain && (
					<>
						<ContextMenuItem onClick={() => setRecipeMainIngredient(ingredientId)}>
							<StarIcon />
							Set to first ingredient
						</ContextMenuItem>
						<ContextMenuItem onClick={() => moveUpRecipeIngredient(ingredientId)}>
							<MoveUpIcon />
							Move up
						</ContextMenuItem>
					</>
				)}
				{!isLast && (
					<ContextMenuItem onClick={() => moveDownRecipeIngredient(ingredientId)}>
						<MoveDownIcon />
						Move Down
					</ContextMenuItem>
				)}
				<ContextMenuItem
					variant="destructive"
					onClick={() => recipeRemove(ingredient.id)}
					className="items-center"
				>
					<Trash2Icon />
					Remove From Mix
				</ContextMenuItem>
				<ContextMenuItem variant="destructive" onClick={clearRecipe} className="items-center">
					<Trash2Icon />
					Clear Recipe
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

function PurchaseSelect({ ingredientId, index }: { ingredientId: string; index: number }) {
	const open = useObservable(false);
	const isOpen = use$(open);
	const {
		state: { currentMixData },
		actions: { setRecipeIngredientPurchaseOption },
	} = useMixManager();

	const recipe = currentMixData.recipe;
	const currentSelectedId = recipe[index].selected_purchase_option_id;
	const {
		actions: { getIngredientPurchasesByIngredientId, getIngredientPurchaseById },
	} = useIngredientsManager();
	const purchaseOptions = getIngredientPurchasesByIngredientId(ingredientId)?.sort(
		(a, b) => b.price - a.price,
	);
	const currentSelected = getIngredientPurchaseById(currentSelectedId ?? "");

	useObserveEffect(recipe[index].selected_purchase_option_id, () => {
		if (!purchaseOptions) {
			return;
		}
		const mostExpensiveOption = purchaseOptions[0];

		if (mostExpensiveOption && !recipe[index].selected_purchase_option_id) {
			setRecipeIngredientPurchaseOption(ingredientId, mostExpensiveOption.id);
		}
	});
	return (
		<Select
			value={currentSelectedId ?? undefined}
			onValueChange={(value) => setRecipeIngredientPurchaseOption(ingredientId, value)}
			open={isOpen}
			onOpenChange={(value) => open.set(value)}
		>
			<SelectTrigger className="btn w-full justify-between flex preset-outlined-surface-200-800 theme-decorated decorator-top-right focus:preset-outlined-primary-500 hover:preset-tonal">
				<div className="flex justify-between w-full">
					<span>{currentSelected?.source}</span>
					<span>{formatUSD(currentSelected?.price ?? 0)}</span>
				</div>
				<ChevronDownIcon className="h-4 w-4 text-primary-500 opacity-50" />
			</SelectTrigger>
			<SelectContent
				className="card preset-filled-surface-50-950 preset-outlined-primary-50-950 overflow-y-auto"
				style={{ maxHeight: "min(50vh, 345px)" }}
			>
				<div className="pl-3 py-1 font-bold">
					<span>Purchase From</span>
				</div>
				{purchaseOptions?.map((option) => (
					<SelectItem
						onPointerDown={(e) => e.stopPropagation()}
						onClick={(e) => e.stopPropagation()}
						onContextMenu={(e) => e.stopPropagation()}
						key={option.source}
						value={option.id}
						className="capitalize p-2 hover:preset-tonal card"
					>
						<div className="flex justify-between items-center w-full gap-2">
							<div className=" flex flex-col grow items-start">
								<span className="font-bold capitalize truncate">{option.source}</span>
							</div>
							<div className="badge preset-filled-primary-400-600">
								<span className="font-light">price:</span>
								<span className="font-semibold">${option.price}</span>
							</div>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

function RecipeShow({ ingredientId }: { ingredientId: string }) {
	const open = useObservable(false);
	const isOpen = use$(open);
	const {
		actions: { getIngredientById },
	} = useIngredientsManager();
	const {
		actions: { getMixRecipe },
	} = useMixesManager();
	const recipe = getMixRecipe(ingredientId)?.map((item) => {
		const ing = getIngredientById(item.child_ingredient_id);
		if (ing) return { ...item, ...ing };
	});
	if (!recipe?.length) {
		return <div>no recipe data</div>;
	}
	return (
		<Select value={recipe[0]?.id} open={isOpen} onOpenChange={(value) => open.set(value)}>
			<SelectTrigger className="btn w-full justify-between flex preset-outlined-surface-200-800 theme-decorated decorator-top-right focus:preset-outlined-primary-500 hover:preset-tonal">
				<div className="flex justify-between w-full">
					<span>{recipe[0]?.name}</span>
					<span>{formatWeight(recipe[0]?.amount ?? 0)}</span>
				</div>
				<ChevronDownIcon className="h-4 w-4 text-primary-500 opacity-50" />
			</SelectTrigger>
			<SelectContent
				className="card preset-filled-surface-50-950 preset-outlined-primary-50-950 overflow-y-auto"
				style={{ maxHeight: "min(50vh, 345px)" }}
			>
				<div className="pl-3 py-1 font-bold">
					<span>Recipe</span>
				</div>
				{recipe?.map((option) => (
					<SelectItem
						onPointerDown={(e) => e.stopPropagation()}
						onClick={(e) => e.stopPropagation()}
						onContextMenu={(e) => e.stopPropagation()}
						key={option?.id}
						value={option?.id ?? ""}
						className="capitalize p-2 hover:preset-tonal card"
					>
						<div className="flex justify-between items-center w-full gap-2">
							<div className=" flex flex-col grow items-start">
								<span className="font-bold capitalize truncate">{option?.name}</span>
							</div>
							<div className="badge preset-filled-primary-400-600">
								<span className="font-light">amount:</span>
								<span className="font-semibold">{formatWeight(option?.amount ?? 0)}</span>
							</div>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
