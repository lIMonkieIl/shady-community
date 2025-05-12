"use client";
import { cropPlannerState$ } from "@/lib/state/local/cropPlanner";
import { formatUSD } from "@/lib/utils/helpers";
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

export default function CropPlannerProfit() {
	const selectedSeedIndex = use$(cropPlannerState$.input.selectedSeedIndex);
	const selectedSeed = use$(cropPlannerState$.seeds[selectedSeedIndex]);
	const size = use$(cropPlannerState$.input.cropSize);
	const cropCost = use$(cropPlannerState$.computed.cropCost);
	const sellGangPerG = 4;
	const sellGangTotal =
		(selectedSeed?.strainYield ?? 0) * (selectedSeed?.hours ?? 0) * size * sellGangPerG;

	const profitGangPerG =
		sellGangPerG - cropCost / (selectedSeed.strainYield * selectedSeed.hours * size);
	const profitGangTotal =
		selectedSeed.strainYield * selectedSeed.hours * size * sellGangPerG - cropCost;

	const sellClientPerG = use$(cropPlannerState$.input.sellPrice);
	const sellClientTotal =
		(selectedSeed?.strainYield ?? 0) * (selectedSeed?.hours ?? 0) * size * sellClientPerG;

	const profitClientPerG =
		sellClientPerG - cropCost / (selectedSeed.strainYield * selectedSeed.hours * size);
	const profitClientTotal =
		selectedSeed.strainYield * selectedSeed.hours * size * sellClientPerG - cropCost;

	return (
		<div className="card w-full  overflow-hidden xl:w-[50%] bg-surface-50-950/50 p-2">
			<div className="overflow-hidden">
				<span className="h6">Profit:</span>
				<div className="p-2 flex flex-col gap-4">
					<div className="theme-decorated">
						<Table className="card preset-tonal overflow-hidden">
							<TableCaption className="text-tertiary-300-700/60">
								Profit from crop breakdown
							</TableCaption>
							<TableHeader className="[&_tr]:border-surface-50-950/55 [&_tr]:border-b-4">
								<TableRow className="capitalize text-primary-950-50">
									<TableHead />
									<TableHead className="font-semibold">per g</TableHead>
									<TableHead className="font-semibold">total</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="capitalize font-semibold text-primary-950-50">
										sell gang
									</TableCell>
									<TableCell>{formatUSD(sellGangPerG)}</TableCell>
									<TableCell>{formatUSD(sellGangTotal)}</TableCell>
									<TableCell />
								</TableRow>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="text-primary-950-50 capitalize font-semibold">
										profit gang
									</TableCell>
									<TableCell>{formatUSD(profitGangPerG)}</TableCell>
									<TableCell>{formatUSD(profitGangTotal)}</TableCell>
								</TableRow>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="text-primary-950-50 capitalize font-semibold">
										sell client
									</TableCell>
									<TableCell>{formatUSD(sellClientPerG)}</TableCell>
									<TableCell>{formatUSD(sellClientTotal)}</TableCell>
								</TableRow>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="text-primary-950-50 capitalize font-semibold">
										profit client
									</TableCell>
									<TableCell>{formatUSD(profitClientPerG)}</TableCell>
									<TableCell>{formatUSD(profitClientTotal)}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
