"use client";
import { useMixManager } from "@/hooks/useMixManager";
import { Show, observer } from "@legendapp/state/react";
import { CircleAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../shared/ui/alert";
import MixIngredientCard from "./mixIngredientCard";

const MixerIngredientList = observer(() => {
	const {
		state: { currentMixData, errors },
	} = useMixManager();
	const recipe = currentMixData.recipe;
	return (
		<div className="w-full bg-surface-50-950/50 p-2 max-h-[calc(100vh-5rem)] card flex flex-col space-y-2 overflow-hidden flex-1">
			<div className="space-x-2 flex items-center justify-between">
				<div className="flex items-center">
					<span className="h6">Recipe:</span>
					{errors?.recipe && <span className="text-error-400-600/60 text-sm">{errors.recipe}</span>}
				</div>
			</div>
			<div className=" grid grid-cols-1 items-center md:grid-cols-2 gap-2 overflow-y-auto space-y-2 p-2">
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
});

export default MixerIngredientList;
