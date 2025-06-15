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

export default function CropPlannerYieldSingle() {
	const { selectedSeed } = useCropManager();

	const wetGrams = selectedSeed.grams;
	const wetAmount = selectedSeed.wetAmount;

	const dryGrams = selectedSeed.strainYield * selectedSeed.hours;

	const dryAmount = selectedSeed.strainYield;

	const dryPercent = `${selectedSeed.dryRate}%`;

	const lossGrams = selectedSeed.grams - selectedSeed.strainYield * selectedSeed.hours;

	const lossPercent = `${100 - (selectedSeed?.dryRate ?? 0)}%`;
	return (
		<div className="card w-full overflow-hidden xl:w-[50%]  bg-surface-50-950/50 p-2">
			<div className="space-x-2 flex items-center justify-between">
				<div className="flex items-center">
					<span className="h6">Yield:</span>
					<span className="badge text-xs preset-filled-secondary-400-600">One Plant</span>
				</div>
				<div className="flex items-center">
					<span className="h6">Total:</span>
					<span className="badge text-xs preset-filled-secondary-400-600">
						{formatWeight(dryGrams)}
					</span>
				</div>
			</div>
			<div className="p-2 flex flex-col gap-4">
				<div className="theme-decorated decorator-top-right">
					<Table className="card preset-tonal overflow-hidden">
						<TableCaption className="text-tertiary-300-700/60">
							Stats from a single plant
						</TableCaption>
						<TableHeader className="[&_tr]:border-surface-50-950/55 [&_tr]:border-b-4">
							<TableRow className="capitalize text-primary-950-50">
								<TableHead />
								<TableHead className="font-semibold">G</TableHead>
								<TableHead className="font-semibold">G/H</TableHead>
								<TableHead className="font-semibold">%</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow className="border-surface-50-950/55 border-b-4">
								<TableCell className="capitalize text-primary-950-50">Wet</TableCell>
								<TableCell>{formatWeight(wetGrams)}</TableCell>
								<TableCell>{formatWeight(wetAmount)}</TableCell>
								<TableCell />
							</TableRow>
							<TableRow className="border-surface-50-950/55 border-b-4">
								<TableCell className="text-primary-950-50">Dry</TableCell>
								<TableCell>{formatWeight(dryGrams)}</TableCell>
								<TableCell>{formatWeight(dryAmount)}</TableCell>
								<TableCell>{dryPercent}</TableCell>
							</TableRow>
							<TableRow className="border-surface-50-950/55 border-b-4">
								<TableCell className="text-primary-950-50">Loss</TableCell>
								<TableCell>{formatWeight(lossGrams)}</TableCell>
								<TableCell />
								<TableCell>{lossPercent}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
