"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/shared/ui/alert";
import { useCropManager } from "@/hooks/useCropManager";
import { formatDuration } from "@/lib/utils/helpers";
import { AlertCircle } from "lucide-react";
import SelectStrain from "./strainSelect";

export default function CropPlannerActions() {
	const { sellPrice, selectedSeed, cropSize, updateSellPrice, updateCropSize } = useCropManager();

	return (
		<div className="card xl:w-[50%] h-fit w-full bg-surface-50-950/50 p-2">
			<span className="h6">Crop:</span>
			<div className="p-2 flex flex-col gap-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<label className="label flex-1">
						<span className="label-text capitalize">sell price</span>
						<div className="input-group grid-cols-[auto_1fr_auto]">
							<div className="ig-cell  preset-filled-primary-400-600 text-xs">$</div>
							<input
								className="ig-input"
								value={sellPrice}
								onChange={(value) =>
									updateSellPrice(
										value.currentTarget.value.length === 0
											? 0
											: Number.parseInt(value.currentTarget.value),
									)
								}
								type="number"
								placeholder="10"
							/>
						</div>
					</label>

					<label className="label flex-1">
						<span className="label-text capitalize">crop size</span>
						<div className="input-group grid-cols-[1fr_auto]">
							<input
								className="ig-input"
								value={cropSize}
								onChange={(value) =>
									updateCropSize(
										value.currentTarget.value.length === 0
											? 0
											: Number.parseInt(value.currentTarget.value),
									)
								}
								type="number"
								placeholder="10"
							/>
							<div className="ig-cell preset-filled-primary-400-600 capitalize text-xs">plants</div>
						</div>
					</label>
				</div>
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="label">
						<span className="label-text capitalize">strain</span>
						<SelectStrain />
					</div>
				</div>

				<Alert className="preset-filled-secondary-400-600">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle className="font-bold">Tip:</AlertTitle>
					<AlertDescription className="overflow-hidden">
						<p className="">
							This <code className="code">{selectedSeed.environment ?? "indoor"}</code> strain can
							take <code className="code">{formatDuration(selectedSeed.hours ?? 0)}</code> to grow.
							It needs to be watered{" "}
							<code className="code">
								{Math.ceil(selectedSeed.hours / selectedSeed.waterPerHour)}
							</code>{" "}
							times, roughly every{" "}
							<code className="code">{formatDuration(selectedSeed.waterPerHour)}</code>
						</p>
					</AlertDescription>
				</Alert>
			</div>
		</div>
	);
}
