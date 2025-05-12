"use client";
import { cropPlannerState$ } from "@/lib/state/local/cropPlanner";
import { formatUSD } from "@/lib/utils/helpers";
import { use$ } from "@legendapp/state/react";
import type React from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

export default function CropPlannerCosts() {
	const selectedSeedIndex = use$(cropPlannerState$.input.selectedSeedIndex);
	const selectedSeed = use$(cropPlannerState$.seeds[selectedSeedIndex]);
	const size = use$(cropPlannerState$.input.cropSize);
	const setupCost = use$(cropPlannerState$.computed.setup.totalCost);
	const cropCost = use$(cropPlannerState$.computed.cropCost);
	const equipmentPerG =
		setupCost / (selectedSeed.strainYield * selectedSeed.hours * size);

	const equipmentCrop = setupCost;

	const seedPerG =
		(size * selectedSeed.price) /
		(selectedSeed.strainYield * selectedSeed.hours * size);

	const seedCrop = size * selectedSeed.price;

	const totalPerG =
		cropCost / (selectedSeed.strainYield * selectedSeed.hours * size);

	const totalCrop = cropCost;
	return (
		<div className="card w-full overflow-hidden xl:w-[50%] bg-surface-50-950/50 p-2">
			<span className="h6">Costs:</span>
			<div className="p-2 flex flex-col gap-4">
				<div className="theme-decorated decorator-top-right">
					<Table className="card preset-tonal overflow-hidden">
						<TableCaption className="text-tertiary-300-700/60">
							Crop costs breakdown
						</TableCaption>
						<TableHeader className="[&_tr]:border-surface-50-950/55 [&_tr]:border-b-4">
							<TableRow className="capitalize text-primary-950-50">
								<TableHead />
								<TableHead className="font-semibold">per g</TableHead>
								<TableHead className="font-semibold">crop</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow className="border-surface-50-950/55 border-b-4">
								<TableCell className="capitalize font-semibold text-primary-950-50">
									equipment
								</TableCell>
								<TableCell>{formatUSD(equipmentPerG)}</TableCell>
								<TableCell>{formatUSD(equipmentCrop)}</TableCell>
								<TableCell />
							</TableRow>
							<TableRow className="border-surface-50-950/55 border-b-4">
								<TableCell className="text-primary-950-50 capitalize font-semibold">
									seed
								</TableCell>
								<TableCell>{formatUSD(seedPerG)}</TableCell>
								<TableCell>{formatUSD(seedCrop)}</TableCell>
							</TableRow>
							<TableRow className="border-surface-50-950/55 border-b-4">
								<TableCell className="text-primary-950-50 capitalize font-semibold">
									total
								</TableCell>
								<TableCell>{formatUSD(totalPerG)}</TableCell>
								<TableCell>{formatUSD(totalCrop)}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
