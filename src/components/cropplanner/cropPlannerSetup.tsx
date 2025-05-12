"use client";
import { cropPlannerState$ } from "@/lib/state/local/cropPlanner";
import { use$ } from "@legendapp/state/react";
import type React from "react";
import { formatUSD } from "../../lib/utils/helpers";
import { Button } from "../ui/button";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

export default function CropPlannerSetup() {
	const selectedSeedIndex = use$(cropPlannerState$.input.selectedSeedIndex);
	const selectedSeed = use$(cropPlannerState$.seeds[selectedSeedIndex]);
	const setupInclude = use$(cropPlannerState$.input.setup.include);
	const potsRequired = use$(cropPlannerState$.computed.setup.pots.required);
	const lightsRequired = use$(cropPlannerState$.computed.setup.lights.required);
	const filtersRequired = use$(
		cropPlannerState$.computed.setup.filters.required,
	);
	const dryersRequired = use$(cropPlannerState$.computed.setup.dryers.required);
	const potsEach = use$(cropPlannerState$.computed.setup.pots.each);
	const lightsEach = use$(cropPlannerState$.computed.setup.lights.each);
	const filtersEach = use$(cropPlannerState$.computed.setup.filters.each);
	const dryersEach = use$(cropPlannerState$.computed.setup.dryers.each);
	const potsTCost = use$(cropPlannerState$.computed.setup.pots.tCost);
	const lightsTCost = use$(cropPlannerState$.computed.setup.lights.tCost);
	const filtersTCost = use$(cropPlannerState$.computed.setup.filters.tCost);
	const dryersTCost = use$(cropPlannerState$.computed.setup.dryers.tCost);
	const potsHave = use$(cropPlannerState$.input.setup.pots.have);
	const lightsHave = use$(cropPlannerState$.input.setup.lights.have);
	const filtersHave = use$(cropPlannerState$.input.setup.filters.have);
	const dryersHave = use$(cropPlannerState$.input.setup.dryers.have);

	if (selectedSeed.environment === "outdoor") {
		return null;
	}
	return (
		<div className="card w-full xl:w-[50%] h-fit bg-surface-50-950/50 p-2">
			<span className="h6">Equipment:</span>
			<div className="p-2 flex flex-col gap-4">
				<div className="label flex  flex-wrap items-center gap-2">
					<span className="label-text  capitalize">
						include equipment costs
					</span>
					<nav className="btn-group preset-outlined-surface-200-800 p-1.5 flex w-fit">
						<Button
							size={"sm"}
							variant={!setupInclude ? "filled-primary" : "tonal"}
							className={"capitalize"}
							onClick={() => cropPlannerState$.input.setup.include.set(false)}
						>
							no
						</Button>
						<Button
							size={"sm"}
							variant={setupInclude ? "filled-primary" : "tonal"}
							className={"capitalize"}
							onClick={() => cropPlannerState$.input.setup.include.set(true)}
						>
							yes
						</Button>
					</nav>
				</div>

				{setupInclude && (
					<div className="theme-decorated decorator-top-left">
						<Table className="card preset-tonal overflow-hidden">
							<TableCaption className="text-tertiary-300-700/60">
								Growing equipment breakdown
							</TableCaption>
							<TableHeader className="[&_tr]:border-surface-50-950/55 [&_tr]:border-b-4">
								<TableRow className="text-primary-950-50">
									<TableHead />
									<TableHead className="font-semibold capitalize">
										pots
									</TableHead>
									<TableHead className="font-semibold capitalize">
										lights
									</TableHead>
									<TableHead className="font-semibold capitalize">
										filters
									</TableHead>
									<TableHead className="font-semibold capitalize">
										dryers
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow className="border-surface-50-950/55 border-b-4 capitalize">
									<TableCell className="text-primary-950-50 capitalize font font-semibold">
										required
									</TableCell>
									<TableCell>{potsRequired}</TableCell>
									<TableCell>{lightsRequired}</TableCell>
									<TableCell>{filtersRequired}</TableCell>
									<TableCell>{dryersRequired}</TableCell>
								</TableRow>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="text-primary-950-50 capitalize font font-semibold">
										price
									</TableCell>
									<TableCell>{formatUSD(potsEach)}</TableCell>
									<TableCell>{formatUSD(lightsEach)}</TableCell>
									<TableCell>{formatUSD(filtersEach)}</TableCell>
									<TableCell>{formatUSD(dryersEach)}</TableCell>
								</TableRow>
								<TableRow className="border-surface-50-950/55 border-b-4">
									<TableCell className="text-primary-950-50 capitalize font font-semibold">
										total
									</TableCell>
									<TableCell>{formatUSD(potsTCost)}</TableCell>
									<TableCell>{formatUSD(lightsTCost)}</TableCell>
									<TableCell>{formatUSD(filtersTCost)}</TableCell>
									<TableCell>{formatUSD(dryersTCost)}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="text-primary-950-50 capitalize font font-semibold">
										owned
									</TableCell>
									<TableCell>
										<input
											className="input min-w-16"
											value={potsHave}
											onChange={(value) =>
												cropPlannerState$.input.setup.pots.have.set(
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
											value={lightsHave}
											onChange={(value) =>
												cropPlannerState$.input.setup.lights.have.set(
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
											value={filtersHave}
											onChange={(value) =>
												cropPlannerState$.input.setup.filters.have.set(
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
											value={dryersHave}
											onChange={(value) =>
												cropPlannerState$.input.setup.dryers.have.set(
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
