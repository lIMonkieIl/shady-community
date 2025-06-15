"use client";
import { useMixManager } from "@/hooks/useMixManger";
import { formatWeight } from "@/lib/utils/helpers";
import { Show } from "@legendapp/state/react";
import { CircleAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../shared/ui/alert";
import MixIngredientCard from "./mixIngredientCard";

export default function MixerIngredientList() {
	const {
		state: { recipe, totalVolume, purity },
	} = useMixManager();
	return (
		<div className="w-full bg-surface-50-950/50 p-2 max-h-[calc(100vh-5rem)] card flex flex-col space-y-2 overflow-hidden">
			<div className="space-x-2 flex items-center justify-between">
				<div className="flex items-center">
					<span className="h6">Recipe:</span>
				</div>
				<div className="flex space-x-2">
					<div className="flex items-center">
						<span className="h6">Purity:</span>
						<span className="badge font-bold text-xs preset-filled-secondary-400-600">
							{purity}%
						</span>
					</div>
					<div className="flex items-center">
						<span className="h6">Weight:</span>
						<span className="badge font-bold text-xs preset-filled-secondary-400-600">
							{formatWeight(totalVolume)}
						</span>
					</div>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto space-y-2 p-2">
				<Show
					if={recipe.length}
					else={
						<Alert variant={"tonal-warning"}>
							<CircleAlertIcon />
							<AlertTitle>No Ingredients</AlertTitle>
							<AlertDescription>
								<span>
									Add your first ingredient by going to the actions card above and clicking the{" "}
									<mark className="mark">Ingredients</mark> button
								</span>
							</AlertDescription>
						</Alert>
					}
				>
					{recipe.map((ingredient, index) => (
						<MixIngredientCard
							isMain={index === 0}
							isLast={index === recipe.length - 1}
							key={`${index}-${ingredient.child_ingredient_id.split("-")[0]}`}
							ingredientId={ingredient.child_ingredient_id}
							index={index}
						/>
					))}
				</Show>
			</div>
		</div>
	);
}
