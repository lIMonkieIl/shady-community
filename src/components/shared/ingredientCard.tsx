"use client";

import { useMixManager } from "@/hooks/useMixManger";
import { getIngredientById } from "@/lib/state/cloud/ingredientsState";
import { cn, getColorForValue } from "@/lib/utils/helpers";
import { CircleHelpIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Label } from "./ui/label";

export default function IngredientCard({ id }: { isMain?: boolean; id: string }) {
	const ingredient = getIngredientById(id);
	const {
		actions: { recipeAdd },
	} = useMixManager();
	const [open, setOpen] = useState(false);
	return (
		<div className="card relative bg-surface-200-800/30 border-3 space-y-2 border-surface-500/50 grid grid-rows-[1fr_auto] h-full">
			{/* Top - fills available space */}
			<div className="card absolute top-3 right-3 preset-tonal shrink-0">
				<Image
					width={75}
					height={75}
					src={`/images/${ingredient.image}`}
					alt={`${ingredient.category} image`}
				/>
			</div>
			<div className="p-4 pb-0">
				<div className="">
					<span className="h6">{ingredient.name}</span>
				</div>
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
			</div>

			{/* Bottom - takes only what it needs */}
			<div className="p-2 pt-0 flex items-center justify-end space-x-2">
				<Button variant={"tonal-secondary"}>Load</Button>
				<Button onClick={() => recipeAdd(ingredient.id)} variant={"tonal-success"}>
					Add
				</Button>
			</div>
		</div>
	);
}
