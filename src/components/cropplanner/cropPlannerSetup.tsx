"use client";
import { useCropManager } from "@/hooks/useCropManager";
import { formatUSD } from "../../lib/utils/helpers";
import { Button } from "../shared/ui/button";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../shared/ui/table";

export default function CropPlannerSetup() {
	const { selectedSeed, setup, setIncludeSetup, updateAlreadyOwnedItems } = useCropManager();

	if (selectedSeed.environment === "outdoor") {
		return null;
	}
	return (
		<div className="card w-full xl:w-[50%] h-fit bg-surface-50-950/50 p-2">
			<span className="h6">Equipment:</span>
			<div className="p-2 flex flex-col gap-4">
				<div className="label flex  flex-wrap items-center gap-2">
					<span className="label-text  capitalize">include equipment costs</span>
					<nav className="btn-group preset-outlined-surface-200-800 p-1.5 flex w-fit">
						<Button
							size={"sm"}
							variant={!setup.include ? "filled-primary" : "tonal"}
							className={"capitalize"}
							onClick={() => setIncludeSetup(false)}
						>
							no
						</Button>
						<Button
							size={"sm"}
							variant={setup.include ? "filled-primary" : "tonal"}
							className={"capitalize"}
							onClick={() => setIncludeSetup(true)}
						>
							yes
						</Button>
					</nav>
				</div>

				{setup.include && (
					<div className="theme-decorated decorator-top-left">
						<Table className="card preset-tonal overflow-hidden">
							<TableCaption className="text-tertiary-300-700/60">
								Growing equipment breakdown
							</TableCaption>
							<TableHeader className="[&_tr]:border-surface-50-950/55 [&_tr]:border-b-4">
								<TableRow className="text-primary-950-50">
									<TableHead />
									<TableHead className="font-semibold capitalize">pots</TableHead>
									<TableHead className="font-semibold capitalize">lights</TableHead>
									<TableHead className="font-semibold capitalize">filters</TableHead>
									<TableHead className="font-semibold capitalize">dryers</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow className="border-surface-50-950/55 border-b-4 capitalize">
									<TableCell className="text-primary-950-50 capitalize font font-semibold">
										required
									</TableCell>
									<TableCell>{setup.pots.required}</TableCell>
									<TableCell>{setup.lights.required}</TableCell>
									<TableCell>{setup.filters.required}</TableCell>
									<TableCell>{setup.dryers.required}</TableCell>
								</TableRow>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="text-primary-950-50 capitalize font font-semibold">
										price
									</TableCell>
									<TableCell>{formatUSD(setup.pots.each)}</TableCell>
									<TableCell>{formatUSD(setup.lights.each)}</TableCell>
									<TableCell>{formatUSD(setup.filters.each)}</TableCell>
									<TableCell>{formatUSD(setup.dryers.each)}</TableCell>
								</TableRow>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="text-primary-950-50 capitalize font font-semibold">
										total
									</TableCell>
									<TableCell>{formatUSD(setup.pots.tCost)}</TableCell>
									<TableCell>{formatUSD(setup.lights.tCost)}</TableCell>
									<TableCell>{formatUSD(setup.filters.tCost)}</TableCell>
									<TableCell>{formatUSD(setup.dryers.tCost)}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="text-primary-950-50 capitalize font font-semibold">
										owned
									</TableCell>
									<TableCell>
										<input
											className="input min-w-16"
											value={setup.pots.have}
											onChange={(value) =>
												updateAlreadyOwnedItems(
													"pots",
													value.currentTarget.value.length === 0
														? 0
														: Number.parseInt(value.currentTarget.value),
												)
											}
											type="number"
										/>
									</TableCell>
									<TableCell>
										<input
											className="input min-w-16"
											value={setup.lights.have}
											onChange={(value) =>
												updateAlreadyOwnedItems(
													"lights",
													value.currentTarget.value.length === 0
														? 0
														: Number.parseInt(value.currentTarget.value),
												)
											}
											type="number"
										/>
									</TableCell>
									<TableCell>
										<input
											className="input min-w-16"
											value={setup.filters.have}
											onChange={(value) =>
												updateAlreadyOwnedItems(
													"filters",
													value.currentTarget.value.length === 0
														? 0
														: Number.parseInt(value.currentTarget.value),
												)
											}
											type="number"
										/>
									</TableCell>
									<TableCell>
										<input
											className="input min-w-16"
											value={setup.dryers.have}
											onChange={(value) =>
												updateAlreadyOwnedItems(
													"dryers",
													value.currentTarget.value.length === 0
														? 0
														: Number.parseInt(value.currentTarget.value),
												)
											}
											type="number"
										/>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</div>
	);
}
