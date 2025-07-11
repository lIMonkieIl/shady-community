"use client";
import { useIngredientsManager } from "@/hooks/useIngredientsManager";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMixManager } from "@/hooks/useMixManager";
import { BREAKPOINTS } from "@/lib/constants/theme/Breakpoints";
import { cn } from "@/lib/utils/helpers";
import { observable } from "@legendapp/state";
import { Show, observer, use$, useObservable } from "@legendapp/state/react";
import { Check, ChevronDown, PillIcon, XIcon } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger } from "../shared/ui/select";

export default function MixActionIngredientsSelect() {
	const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.sm}px)`);
	const isOpen = useObservable(false);
	const open = use$(isOpen);

	return (
		<Show
			if={isMobile}
			else={
				<Dialog open={open} onOpenChange={(value) => isOpen.set(value)}>
					<DialogTrigger asChild>
						<Button
							onClick={() => isOpen.set(true)}
							variant="tonal-primary"
							size="sm"
							className=" justify-start"
						>
							<PillIcon />
							Ingredients
						</Button>
					</DialogTrigger>
					<DialogContent className="card preset-filled-surface-50-950 preset-outlined-primary-50-950 w-[calc(100vw-5rem)] h-[calc(100dvh-5rem)] max-w-none gap-0 rounded-xl flex flex-col justify-start">
						<DialogHeader className="">
							<DialogTitle className="h6">Ingredients</DialogTitle>
							<DialogDescription>
								<span>Select an ingredient</span>
							</DialogDescription>
						</DialogHeader>
						<IngredientsDisplayFilter />
						{/* <div>hello</div> */}
						<IngredientsDisplay />
					</DialogContent>
				</Dialog>
			}
		>
			<Drawer onClose={() => isOpen.set(false)} open={open}>
				<DrawerTrigger asChild>
					<Button
						onClick={() => isOpen.set(true)}
						variant="tonal-primary"
						size="sm"
						className=" justify-start"
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
					<IngredientsDisplayFilter />
					<IngredientsDisplay />
				</DrawerContent>
			</Drawer>
		</Show>
	);
}

export const IngredientsDisplayFilter = observer((props: React.ComponentProps<"div">) => {
	const filters = use$(ingredientFilters);

	return (
		<div className="flex flex-col px-4 pb-4 gap-2" {...props}>
			{/* Search Input */}
			<div className="input-group grid-cols-[1fr_auto]">
				<input
					className="ig-input"
					placeholder="Search ingredients..."
					value={filters.search}
					onChange={(e) => ingredientFilters.search.set(e.target.value)}
				/>

				<button
					onClick={() => ingredientFilters.search.set("")}
					disabled={filters.search.length === 0}
					type="button"
					className="ig-btn text-xs px-1 preset-tonal"
					title="Username already in use."
				>
					<XIcon />
				</button>
			</div>
			<CategorySelect />
			{/* <SortFilterSelect /> */}
		</div>
	);
});

const CategorySelect = observer(() => {
	const isOpen = useObservable(false);
	const filters = use$(ingredientFilters);

	const handleSelect = (value: string) => {
		ingredientFilters.category.set(value as IIngredientFilters["category"]);
		isOpen.set(false);
	};

	return (
		<Select
			value={filters.category ?? undefined}
			onValueChange={handleSelect}
			open={isOpen.get()}
			onOpenChange={(value) => isOpen.set(value)}
		>
			<SelectTrigger className="btn w-full justify-between flex preset-outlined-surface-200-800 theme-decorated decorator-top-right focus:preset-outlined-primary-500 hover:preset-tonal">
				<span className="capitalize">Category: {filters.category ?? "Select Category"}</span>
				<ChevronDown className="h-4 w-4 text-primary-500 opacity-50" />
			</SelectTrigger>
			<SelectContent
				className="card preset-filled-surface-50-950 preset-outlined-primary-50-950 overflow-y-auto"
				style={{ maxHeight: "min(50vh, 345px)" }}
			>
				<div className="pl-3 py-1 font-bold">
					<span>Categories</span>
				</div>
				{["All", "Drug", "Filler", "Additive", "Pre-Mix"].map((category) => (
					<SelectItem
						key={category}
						value={category}
						className="capitalize hover:preset-tonal card"
					>
						{category === filters.category && (
							<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
								<Check className="h-4 w-4 text-primary-300-700" />
							</span>
						)}
						<div className="flex justify-between items-center w-full gap-2">
							<div className=" flex flex-col grow items-start">
								<span className="font-bold capitalize truncate">{category}</span>
							</div>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
});
// const SortFilterSelect = observer(() => {
// 	const isOpen = useObservable(false);
// 	const filters = use$(ingredientFilters);
// 	const {
// 		state: { allIngredients },
// 	} = useIngredientsManager();
// 	const ingredients = Object.values(allIngredients);
// 	const sample = ingredients[0];

// 	const stringAndNumberKeys = sample ? getStringAndNumberKeys(sample) : [];
// 	const handleSelect = (value: string) => {
// 		ingredientFilters.sort.filter.set(value);
// 		isOpen.set(false);
// 	};

// 	return (
// 		<Select
// 			value={filters.sort.filter ?? undefined}
// 			onValueChange={handleSelect}
// 			open={isOpen.get()}
// 			onOpenChange={(value) => isOpen.set(value)}
// 		>
// 			<SelectTrigger className="btn w-full justify-between flex preset-outlined-surface-200-800 theme-decorated decorator-top-right focus:preset-outlined-primary-500 hover:preset-tonal">
// 				<span className="capitalize">Filter: {filters.sort.filter ?? "Select Filter"}</span>
// 				<ChevronDown className="h-4 w-4 text-primary-500 opacity-50" />
// 			</SelectTrigger>
// 			<SelectContent
// 				className="card preset-filled-surface-50-950 preset-outlined-primary-50-950 overflow-y-auto"
// 				style={{ maxHeight: "min(50vh, 345px)" }}
// 			>
// 				<div className="pl-3 py-1 font-bold">
// 					<span>Filters</span>
// 				</div>
// 				{stringAndNumberKeys.map((key) => {
// 					const keyStr = String(key); // Convert to string
// 					return (
// 						<SelectItem key={keyStr} value={keyStr} className="capitalize hover:preset-tonal card">
// 							{keyStr === filters.sort.filter && (
// 								<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
// 									<Check className="h-4 w-4 text-primary-300-700" />
// 								</span>
// 							)}
// 							<div className="flex justify-between items-center w-full gap-2">
// 								<div className="flex flex-col grow items-start">
// 									<span className="font-bold capitalize truncate">{keyStr}</span>
// 								</div>
// 							</div>
// 						</SelectItem>
// 					);
// 				})}
// 			</SelectContent>
// 		</Select>
// 	);
// });
export interface IIngredientFilters {
	search: string;
	category: "Pre-Mix" | "Drug" | "Additive" | "Filler" | "All";
	sort: {
		filter: string; // fields from ingredients
		by: "asc" | "desc";
	};
}

export const ingredientFilters = observable<IIngredientFilters>({
	search: "",
	category: "All",
	sort: {
		filter: "name",
		by: "asc",
	},
});

const IngredientsDisplay = observer(({ className, ...props }: React.ComponentProps<"div">) => {
	const {
		state: { allIngredients },
	} = useIngredientsManager();
	const {
		state: { currentMixData },
	} = useMixManager();
	const recipe = currentMixData.recipe;
	const recipeIngredientIds = new Set(recipe.map((r) => r.child_ingredient_id));

	const filters = use$(ingredientFilters);
	const filteredIngredients = Object.values(allIngredients).filter((ingredient) => {
		// if (ingredient.category === "Mix") return false;
		if (recipeIngredientIds.has(ingredient.id)) return false;
		if (filters.category && filters.category !== "All" && ingredient.category !== filters.category)
			return false;
		if (filters.search && !ingredient.name.toLowerCase().includes(filters.search.toLowerCase()))
			return false;

		return true;
	});
	// .sort((a, b) => {
	// 	const { filter, by } = filters.sort;
	// 	const aValue = a[filter];
	// 	const bValue = b[filter];

	// 	if (aValue == null || bValue == null) return 0;

	// 	// Compare strings or numbers
	// 	if (typeof aValue === "string" && typeof bValue === "string") {
	// 		return by === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
	// 	}
	// 	if (typeof aValue === "number" && typeof bValue === "number") {
	// 		return by === "asc" ? aValue - bValue : bValue - aValue;
	// 	}

	// 	// Default to no sorting if types mismatch
	// 	return 0;
	// });

	return (
		<div className={cn("flex-1 overflow-y-scroll", className)} {...props}>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-4">
				{filteredIngredients.map((ingredient, index) => (
					<IngredientCard key={`${index}-${ingredient.id.split("-")[0]}`} ingredient={ingredient} />
				))}
			</div>
		</div>
	);
});
