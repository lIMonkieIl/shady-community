"use client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BREAKPOINTS } from "@/lib/constants/theme/Breakpoints";
import { ingredientsState$ } from "@/lib/state/cloud/ingredientsState";
import { cn } from "@/lib/utils/helpers";
import { use$, useObservable } from "@legendapp/state/react";
import { PillIcon } from "lucide-react";
import IngredientCard from "../shared/ingredientCard";
import { Button } from "../shared/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../shared/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../shared/ui/drawer";

export default function MixActionIngredientsSelect() {
	const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.sm}px)`);
	const isOpen = useObservable(false);
	const open = use$(isOpen);

	if (isMobile) {
		return (
			<Drawer onClose={() => isOpen.set(false)} open={open}>
				<DrawerTrigger asChild>
					<Button
						onClick={() => isOpen.set(true)}
						variant="tonal-primary"
						size="sm"
						className="w-full justify-start"
					>
						<PillIcon />
						Ingredients
					</Button>
				</DrawerTrigger>
				<DrawerContent className="h-[95dvh] card preset-filled-surface-50-950 rounded-b-none">
					<DrawerHeader>
						<DrawerTitle className="h6">Ingredients</DrawerTitle>
						<DrawerDescription>Select an ingredient</DrawerDescription>
					</DrawerHeader>
					<IngredientsDisplay />
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog open={open} onOpenChange={(value) => isOpen.set(value)}>
			<DialogTrigger asChild>
				<Button
					onClick={() => isOpen.set(true)}
					variant="tonal-primary"
					size="sm"
					className="w-full justify-start"
				>
					<PillIcon />
					Ingredients
				</Button>
			</DialogTrigger>
			<DialogContent className="card preset-filled-surface-50-950 preset-outlined-primary-50-950 w-[calc(100vw-5rem)] h-[calc(100dvh-5rem)] max-w-none rounded-xl">
				<DialogHeader className="">
					<DialogTitle className="h6">Ingredients</DialogTitle>
					<DialogDescription>Select an ingredient</DialogDescription>
				</DialogHeader>
				<IngredientsDisplay />
			</DialogContent>
		</Dialog>
	);
}

function IngredientsDisplay({ className, ...props }: React.ComponentProps<"div">) {
	const ingredients = use$(ingredientsState$);

	return (
		<div className={cn("flex-1 overflow-y-auto", className)} {...props}>
			<div className="flex flex-col space-y-4 p-4">
				{Object.values(ingredients).map((ingredient, index) => (
					<IngredientCard key={`${index}-${ingredient.id.split("-")[0]}`} id={ingredient.id} />
				))}
			</div>
		</div>
	);
}
