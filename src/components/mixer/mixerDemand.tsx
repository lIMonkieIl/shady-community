"use client";
import type { IIngredientDemand } from "@/hooks/useIngredientsManager";
import { useMixManager } from "@/hooks/useMixManager";
import { cn } from "@/lib/utils/helpers";
import { HoverCard } from "@radix-ui/react-hover-card";
import { CircleHelpIcon, CrownIcon, StarIcon } from "lucide-react";
import { useState } from "react";
import { HoverCardContent, HoverCardTrigger } from "../shared/ui/hover-card";
import { Label } from "../shared/ui/label";

export default function MixerDemand() {
	const {
		state: { currentMixData },
	} = useMixManager();
	const [open, setOpen] = useState(false);

	const { demand } = currentMixData;
	if (demand?.length === 0) {
		return null;
	}

	const sectorA = demand?.filter((s) => s.sector === "A");
	const sectorB = demand?.filter((s) => s.sector === "B");
	const sectorC = demand?.filter((s) => s.sector === "C");

	// Find best location in each sector
	const getBestLocation = (sectorData: IIngredientDemand[] | undefined) => {
		if (!sectorData || sectorData.length === 0) return null;
		return sectorData?.reduce((max, item) => (item.demand_value > max.demand_value ? item : max));
	};

	const bestLocations = {
		A: getBestLocation(sectorA as IIngredientDemand[]),
		B: getBestLocation(sectorB as IIngredientDemand[]),
		C: getBestLocation(sectorC as IIngredientDemand[]),
	};

	// Rank sectors by their best demand value
	const sectorRankings = Object.entries(bestLocations)
		.filter(([_, data]) => data !== null)
		.sort(([_, a], [__, b]) => (b?.demand_value || 0) - (a?.demand_value || 0))
		.map(([sector], index) => ({ sector, rank: index }));

	// Create a map for easy lookup
	const sectorRankMap = sectorRankings?.reduce(
		(acc, { sector, rank }) => {
			acc[sector] = rank;
			return acc;
		},
		{} as Record<string, number>,
	);

	// Find min and max demand values for color scaling
	const allDemandValues = demand?.map((item) => item.demand_value) || [];
	const minDemand = Math.min(...allDemandValues);
	const maxDemand = Math.max(...allDemandValues);

	const bestLocation = demand?.reduce((max, item) =>
		item.demand_value > max.demand_value ? item : max,
	);

	return (
		<div className="card w-full h-fit bg-surface-50-950/50 p-2 relative space-y-2 flex flex-col">
			<div className="space-x-2 flex items-center justify-between">
				<div className="flex gap-2 justify-start items-center">
					<span className="h6">Demand:</span>
					<HoverCard open={open} onOpenChange={setOpen} openDelay={10}>
						<HoverCardTrigger onClick={() => setOpen(true)} className="cursor-help">
							<CircleHelpIcon size={18} />
						</HoverCardTrigger>
						<HoverCardContent
							side="right"
							align="start"
							className="w-50 card preset-tonal-surface  border-surface-500/50 border-2 p-2"
						>
							<div>
								<span className="h6">Icon Ref:</span>
								<div className="flex flex-col space-y-3 p-2">
									<div className="flex space-x-2">
										<CrownIcon size={20} className="text-tertiary-400-600 fill-tertiary-400-600" />
										<span>Best overall</span>
									</div>
									<div className="flex space-x-2">
										<StarIcon size={20} className="text-tertiary-400-600 fill-tertiary-400-600" />
										<span>Highest in sector</span>
									</div>
								</div>
							</div>
							<div>
								<span className="h6">Color Ref:</span>
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
							</div>
						</HoverCardContent>
					</HoverCard>
				</div>
			</div>
			<div className="flex-1 p-2">
				<div className="flex flex-col gap-2 items-stretch min-h-0">
					{[
						{ title: "Sector A", data: sectorA, sector: "A" },
						{ title: "Sector B", data: sectorB, sector: "B" },
						{ title: "Sector C", data: sectorC, sector: "C" },
					].map(({ data, title, sector }, index) => (
						<DemandCard
							key={title}
							index={index}
							title={title}
							data={data as IIngredientDemand[]}
							sectorRank={sectorRankMap[sector] ?? 3}
							bestlocation={bestLocation}
							bestlocations={bestLocations}
							minDemand={minDemand}
							maxDemand={maxDemand}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

function DemandCard({
	data,
	title,
	index,
	sectorRank,
	minDemand,
	maxDemand,
	bestlocation,
	bestlocations,
}: {
	title: string;
	data: IIngredientDemand[];
	index: number;
	sectorRank: number;
	minDemand: number;
	maxDemand: number;
	bestlocation: IIngredientDemand | undefined;
	bestlocations: {
		A: IIngredientDemand | null;
		B: IIngredientDemand | null;
		C: IIngredientDemand | null;
	};
}) {
	// Assign colors based on ranking: 0 = best (green), 1 = second (blue), 2+ = worst (red)
	const getPresetClass = (rank: number) => {
		switch (rank) {
			case 0:
				return "bg-success-500/10"; // Green for best
			case 1:
				return "bg-warning-500/10"; // Blue for second
			default:
				return "bg-error-500/10"; // Red for worst
		}
	};
	const presetClass = getPresetClass(sectorRank);

	return (
		<div
			className={`${index === 0 ? "rounded-b-none" : index === 1 ? "rounded-t-none rounded-b-none" : "rounded-t-none"} card overflow-hidden ${presetClass} flex-1 flex flex-col`}
		>
			<div
				className={`pl-2 pt-0.5 rounded-t-container ${index === 0 ? "rounded-b-none" : index === 1 ? "rounded-t-none rounded-b-none" : "rounded-t-none"} card flex items-center gap-2 preset-filled-surface-200-800 rounded-none`}
			>
				<span className="">{title}</span>
				{sectorRank === 0 && (
					<CrownIcon size={20} className="text-tertiary-400-600 fill-tertiary-400-600" />
				)}
			</div>
			<hr className="hr border-primary-400-600 border-t-2" />
			<div className="flex-1 p-3">
				{(data?.length ?? 0) > 0 ? (
					<ul className="flex gap-4 flex-wrap items-center">
						{data
							?.sort((a, b) => b.demand_value - a.demand_value)
							.map((item, index) => (
								<DemandCardItem
									key={`${index}-${item.location}`}
									item={item}
									isBestSectorLocation={bestlocations[item.sector] === item}
									isBest={bestlocation === item}
									minDemand={minDemand}
									maxDemand={maxDemand}
								/>
							))}
					</ul>
				) : (
					<div className="">No demand for this sector</div>
				)}
			</div>
		</div>
	);
}

function DemandCardItem({
	item,
	isBest,
	isBestSectorLocation,
	minDemand,
	maxDemand,
}: {
	item: IIngredientDemand;
	minDemand: number;
	maxDemand: number;
	isBest: boolean;
	isBestSectorLocation: boolean;
}) {
	return (
		<li
			className={`${getLocationColorClass(item.demand_value, minDemand, maxDemand)} flex gap-0.5`}
		>
			<span>{item.location}:</span>
			<span className="font-semibold">{item.demand_value}%</span>
			{(isBest || isBestSectorLocation) && (
				<span className="flex">
					{isBestSectorLocation && (
						<StarIcon size={20} className=" text-tertiary-400-600 fill-tertiary-400-600" />
					)}

					{isBest && (
						<CrownIcon size={20} className="text-tertiary-400-600 fill-tertiary-400-600" />
					)}
				</span>
			)}
		</li>
	);
}
const getLocationColorClass = (demandValue: number, min: number, max: number) => {
	// Normalize demand value to 0-1 range (0 = lowest, 1 = highest)
	const normalizedValue = (demandValue - min) / (max - min);
	if (normalizedValue >= 0.8) {
		return "badge bg-success-400-600/20 outline-2 outline-success-400-600/70";
	}
	if (normalizedValue >= 0.6) {
		return "badge bg-primary-400-600/20 outline-2 outline-primary-400-600/70";
	}
	if (normalizedValue >= 0.4) {
		return "badge bg-tertiary-400-600/20 outline-2 outline-tertiary-400-600/70";
	}
	if (normalizedValue >= 0.2) {
		return "badge bg-warning-400-600/20 outline-2 outline-warning-400-600/70";
	}
	return "badge bg-error-400-600/20 outline-2 outline-error-400-600/70";
};
const getColorKeySteps = (min: number, max: number, steps = 5) => {
	const stepSize = (max - min) / (steps - 1);
	return Array.from({ length: steps }, (_, i) => {
		const value = min + stepSize * i;
		let label = "";

		switch (i) {
			case 0:
				label = "Very Low";
				break;
			case 1:
				label = "Low";
				break;
			case 2:
				label = "Medium";
				break;
			case 3:
				label = "High";
				break;
			case 4:
				label = "Very High";
				break;
			default:
				label = `Level ${i + 1}`;
		}

		return { label, value };
	});
};
