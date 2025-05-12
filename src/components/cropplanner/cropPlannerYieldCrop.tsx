"use client";
import { cropPlannerState$ } from "@/lib/state/local/cropPlanner";
import { formatWeight } from "@/lib/utils/helpers";
import { use$ } from "@legendapp/state/react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

export default function CropPlannerYieldCrop() {
	const selectedSeedIndex = use$(cropPlannerState$.input.selectedSeedIndex);
	const selectedSeed = use$(cropPlannerState$.seeds[selectedSeedIndex]);
	const size = use$(cropPlannerState$.input.cropSize);
	const wetGramsC = selectedSeed.grams * size;
	const wetAmountC = selectedSeed.wetAmount * size;

	const dryGramsC = selectedSeed.strainYield * selectedSeed.hours * size;

	const dryAmountC = selectedSeed.strainYield * size;

	const dryPercentC = `${selectedSeed.dryRate}%`;

	const lossGramsC = (selectedSeed.grams - selectedSeed.strainYield * selectedSeed.hours) * size;

	const lossPercentC = `${100 - (selectedSeed?.dryRate ?? 0)}%`;
	return (
		<div className="card w-full xl:w-[50%] bg-surface-50-950/50 p-2">
			<div className="overflow-hidden">
				<div className="space-x-2 flex items-center">
					<span className="h6">Yield:</span>
					<span className="badge text-xs preset-filled-secondary-400-600">Crop</span>
				</div>
				<div className="p-2 flex flex-col gap-4">
					<div className="theme-decorated decorator-top-left">
						<Table className="card preset-tonal overflow-hidden">
							<TableCaption className="text-tertiary-300-700/60">Stats from the crop</TableCaption>
							<TableHeader className="[&_tr]:border-surface-50-950/55 [&_tr]:border-b-4">
								<TableRow className=" text-primary-950-50">
									<TableHead />
									<TableHead className="font-semibold capitalize">g</TableHead>
									<TableHead className="font-semibold capitalize">g/h</TableHead>
									<TableHead className="font-semibold capitalize">%</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="capitalize font-semibold text-primary-950-50">
										wet
									</TableCell>
									<TableCell>{formatWeight(wetGramsC)}</TableCell>
									<TableCell>{formatWeight(wetAmountC)}</TableCell>
									<TableCell />
								</TableRow>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="text-primary-950-50 capitalize font-semibold">
										dry
									</TableCell>
									<TableCell>{formatWeight(dryGramsC)}</TableCell>
									<TableCell>{formatWeight(dryAmountC)}</TableCell>
									<TableCell>{dryPercentC}</TableCell>
								</TableRow>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="text-primary-950-50 capitalize font-semibold">
										loss
									</TableCell>
									<TableCell>{formatWeight(lossGramsC)}</TableCell>
									<TableCell />
									<TableCell>{lossPercentC}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
