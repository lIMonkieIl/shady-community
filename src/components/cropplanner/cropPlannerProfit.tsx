"use client";
import { useCropManager } from "@/hooks/useCropManager";
import { formatUSD } from "@/lib/utils/helpers";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../shared/ui/table";

export default function CropPlannerProfit() {
	const { selectedSeed, cropSize, cropCost, sellPrice } = useCropManager();

	const sellGangPerG = 4;
	const sellGangTotal =
		(selectedSeed?.strainYield ?? 0) * (selectedSeed?.hours ?? 0) * cropSize * sellGangPerG;

	const profitGangPerG =
		sellGangPerG - cropCost / (selectedSeed.strainYield * selectedSeed.hours * cropSize);
	const profitGangTotal =
		selectedSeed.strainYield * selectedSeed.hours * cropSize * sellGangPerG - cropCost;

	const sellClientTotal =
		(selectedSeed?.strainYield ?? 0) * (selectedSeed?.hours ?? 0) * cropSize * sellPrice;

	const profitClientPerG =
		sellPrice - cropCost / (selectedSeed.strainYield * selectedSeed.hours * cropSize);
	const profitClientTotal =
		selectedSeed.strainYield * selectedSeed.hours * cropSize * sellPrice - cropCost;

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
									<TableCell>{formatUSD(sellPrice)}</TableCell>
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
