"use client";
import { useIngredientsManager } from "@/hooks/useIngredientsManager";
import { useMixManager } from "@/hooks/useMixManager";
import { cn, formatDiff, formatWeight, getColorForValue } from "@/lib/utils/helpers";
import { CircleHelpIcon } from "lucide-react";
import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../shared/ui/hover-card";
import { Label } from "../shared/ui/label";

export default function MixerMixCard() {
	const {
		state: { currentMixData },
	} = useMixManager();
	const {
		actions: { getIngredientById },
	} = useIngredientsManager();
	const [open, setOpen] = useState(false);

	const firstIngredient = getIngredientById(currentMixData?.recipe[0]?.child_ingredient_id);

	const {
		toxicity,
		strength,
		mix_strengthening,
		addictiveness,
		addedWeight,
		purity,
		totalVolume,
		overdoseChance,
		addictionChance,
	} = currentMixData;

	const toxDif = toxicity - (firstIngredient?.toxicity ?? 0);
	const strengthDif = strength - (firstIngredient?.strength ?? 0);
	const mix_strengtheningDif = mix_strengthening - (firstIngredient?.mix_strengthening ?? 0);
	const addictivenessDif = addictiveness - (firstIngredient?.addictiveness ?? 0);
	return (
		<div className="card w-full bg-surface-50-950/50 p-2 relative space-y-2 flex flex-col">
			<div className="space-x-2 flex items-center justify-between">
				<div className="flex gap-2 justify-start items-center">
					<span className="h6">Mix:</span>
					{/* <HoverCard open={open} onOpenChange={setOpen} openDelay={10}>
						<HoverCardTrigger onClick={() => setOpen(true)} className="cursor-help">
							<CircleHelpIcon size={18} />
						</HoverCardTrigger>
						<HoverCardContent
							side="right"
							align="start"
							className="w-50 card preset-tonal-surface  border-surface-500/50 border-2 p-2"
						>
							<span className="h6">Demand color Key:</span>
							<div className="flex flex-col space-y-3 p-2">
								{getColorKeySteps(minDemand, maxDemand).map(({ label, value }) => (
									<Label
										key={label}
										className={cn(
											"badge w-full",
											getLocationColorClass(value, minDemand, maxDemand),
										)}
									>
										{label}
									</Label>
								))}
							</div>
						</HoverCardContent>
					</HoverCard> */}
				</div>
			</div>

			<div className="flex-1 space-y-2 p-2">
				<div className="w-full space-y-2">
					<div className="flex gap-2 justify-start items-center">
						{/* <span className="h6">Data:</span> */}
					</div>

					<div className=" gap-2 grid grid-cols-3 w-full justify-evenly">
						<Label className={"badge w-full py-2 text-center text-wrap preset-tonal-primary"}>
							Added Weight: {formatWeight(addedWeight)}
						</Label>
						<Label className={"badge w-full py-2 preset-tonal-primary text-wrap text-center"}>
							Total Weight: {formatWeight(totalVolume)}
						</Label>
						<Label className={"badge py-2 text-center text-wrap w-full preset-tonal-primary"}>
							Purity: {purity.toFixed(2)}%
						</Label>
					</div>
				</div>
				<div className="w-full space-y-2">
					<div className="flex gap-2 justify-start items-center">
						<span className="h6">Chance:</span>
						<span className="badge preset-tonal-surface text-xs font-normal p-1">BETA</span>
					</div>

					<div className=" gap-2 grid grid-cols-2 w-full justify-evenly">
						<Label className={"badge w-full preset-tonal-primary"}>
							Overdose: {overdoseChance.toFixed(1)}%
						</Label>
						<Label className={"badge w-full preset-tonal-primary"}>
							Addiction: {addictionChance.toFixed(1)}%
						</Label>
					</div>
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
						<Label
							className={cn(
								"badge w-full flex-col sm:flex-row py-2 justify-center items-center sm:justify-between",
								getColorForValue(currentMixData.toxicity),
							)}
						>
							<span>Tox: {currentMixData.toxicity}</span>
							<span className={cn("opacity-60")}>({formatDiff(toxDif)})</span>
						</Label>
						<Label
							className={cn(
								"badge w-full flex-col sm:flex-row py-2 justify-center items-center sm:justify-between",
								getColorForValue(currentMixData.strength),
							)}
						>
							<span>Str: {currentMixData.strength}</span>
							<span className={cn("opacity-60")}>({formatDiff(strengthDif)})</span>
						</Label>
						<Label
							className={cn(
								"badge w-full flex-col sm:flex-row py-2 justify-center items-center sm:justify-between",
								getColorForValue(currentMixData.mix_strengthening),
							)}
						>
							<span>MixStr: {currentMixData.mix_strengthening}</span>
							<span className={cn("opacity-60")}>({formatDiff(mix_strengtheningDif)})</span>
						</Label>
						<Label
							className={cn(
								"badge w-full flex-col sm:flex-row py-2 justify-center items-center sm:justify-between",
								getColorForValue(currentMixData.addictiveness),
							)}
						>
							<span>Addict: {currentMixData.addictiveness}</span>
							<span className={cn("opacity-60")}>({formatDiff(addictivenessDif)})</span>
						</Label>
					</div>
				</div>
			</div>
		</div>
	);
}
