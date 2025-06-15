"use client";
import { useCropManager } from "@/hooks/useCropManager";
import { formatWeight } from "@/lib/utils/helpers";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../shared/ui/table";

export default function CropPlannerYieldCrop() {
	const { selectedSeed, cropSize } = useCropManager();

	const wetGrams = selectedSeed.grams * cropSize;
	const wetAmount = selectedSeed.wetAmount * cropSize;

	const dryGrams = selectedSeed.strainYield * selectedSeed.hours * cropSize;

	const dryAmount = selectedSeed.strainYield * cropSize;

	const dryPercent = `${selectedSeed.dryRate}%`;

	const lossGrams = (selectedSeed.grams - selectedSeed.strainYield * selectedSeed.hours) * cropSize;

	const lossPercent = `${100 - (selectedSeed?.dryRate ?? 0)}%`;
	return (
		<div className="card w-full xl:w-[50%] bg-surface-50-950/50 p-2">
			<div className="overflow-hidden">
				<div className="space-x-2 flex items-center justify-between">
					<div className="flex items-center">
						<span className="h6">Yield:</span>
						<span className="badge text-xs preset-filled-secondary-400-600">Crop</span>
					</div>
					<div className="flex items-center">
						<span className="h6">Total:</span>
						<span className="badge text-xs preset-filled-secondary-400-600">
							{formatWeight(dryGrams)}
						</span>
					</div>
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
									<TableCell>{formatWeight(wetGrams)}</TableCell>
									<TableCell>{formatWeight(wetAmount)}</TableCell>
									<TableCell />
								</TableRow>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="text-primary-950-50 capitalize font-semibold">
										dry
									</TableCell>
									<TableCell>{formatWeight(dryGrams)}</TableCell>
									<TableCell>{formatWeight(dryAmount)}</TableCell>
									<TableCell>{dryPercent}</TableCell>
								</TableRow>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="text-primary-950-50 capitalize font-semibold">
										loss
									</TableCell>
									<TableCell>{formatWeight(lossGrams)}</TableCell>
									<TableCell />
									<TableCell>{lossPercent}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
