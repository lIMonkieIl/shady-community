"use client";

import { useMixManager } from "@/hooks/useMixManager";
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
	const {
		state: { currentMixData },
	} = useMixManager();

	const {
		costPerGram,
		cost,
		sellPriceTotal,
		profit,
		profitFromCutting,
		profitFromMarkup,
		profitPerGram,
		sellPrice,
	} = currentMixData;
	return (
		<div className="card w-full  overflow-hidden bg-surface-50-950/50 p-2">
			<div className="overflow-hidden">
				<span className="h6">Breakdown:</span>
				<div className="p-2 flex flex-col gap-4">
					<div className="theme-decorated">
						<Table className="card preset-tonal overflow-hidden">
							<TableCaption className="text-tertiary-300-700/60">
								A breakdown of the current mix
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
										cost
									</TableCell>
									<TableCell>{formatUSD(costPerGram)}</TableCell>
									<TableCell>{formatUSD(cost)}</TableCell>
									<TableCell />
								</TableRow>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="capitalize font-semibold text-primary-950-50">
										sell
									</TableCell>
									<TableCell>{formatUSD(sellPrice)}</TableCell>
									<TableCell>{formatUSD(sellPriceTotal)}</TableCell>
									<TableCell />
								</TableRow>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="capitalize font-semibold text-primary-950-50">
										Profit
									</TableCell>
									<TableCell>{formatUSD(profitPerGram)}</TableCell>
									<TableCell>{formatUSD(profit)}</TableCell>
									<TableCell />
								</TableRow>

								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="capitalize font-semibold text-primary-950-50">
										Profit From cutting
									</TableCell>
									<TableCell />
									<TableCell>{formatUSD(profitFromCutting)}</TableCell>
									<TableCell />
								</TableRow>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="capitalize font-semibold text-primary-950-50">
										Profit from mark-up
									</TableCell>
									<TableCell />
									<TableCell>{formatUSD(profitFromMarkup)}</TableCell>
									<TableCell />
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
