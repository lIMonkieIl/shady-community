import { useMixManager } from "@/hooks/useMixManger";
import { useState } from "react";
import { Button } from "../shared/ui/button";

export function ScaleMixInput() {
	const {
		actions: { scaleMix, scaleToMax, scaleToLowest },
	} = useMixManager();
	const [value, setValue] = useState<number>(0);
	const [showCustom, setShowCustom] = useState<boolean>(false);

	return (
		<span className="label flex-1">
			<span className="label-text capitalize">Scale mix</span>
			<div className="flex flex-col justify-start gap-2">
				<nav className="gap-2 flex flex-wrap items-center">
					<Button
						size="sm"
						variant={"tonal"}
						className="capitalize"
						onClick={() => {
							setValue(0);

							scaleToLowest();
						}}
					>
						scale to Min
					</Button>
					<Button
						size="sm"
						variant={"tonal"}
						className="capitalize"
						onClick={() => {
							setValue(0);

							scaleToMax();
						}}
					>
						scale to Max
					</Button>
					<Button
						size="sm"
						variant={"tonal"}
						className="capitalize"
						onClick={() => {
							setValue(0);
							scaleMix(2, "divide");
						}}
					>
						Divide by 2
					</Button>
					<Button
						size="sm"
						variant={"tonal"}
						className="capitalize"
						onClick={() => {
							setValue(0);
							scaleMix(3, "divide");
						}}
					>
						Divide by 3
					</Button>
					<Button
						size="sm"
						variant={"tonal"}
						className="capitalize"
						onClick={() => {
							setValue(0);
							scaleMix(1.5, "multiply");
						}}
					>
						Multiply by 1.5
					</Button>
					<Button
						size="sm"
						variant={"tonal"}
						className="capitalize"
						onClick={() => {
							setValue(0);
							scaleMix(2, "multiply");
						}}
					>
						Multiply by 2
					</Button>
					<Button
						size="sm"
						variant={"tonal"}
						className="capitalize"
						onClick={() => {
							setValue(0);
							scaleMix(3, "multiply");
						}}
					>
						Multiply by 3
					</Button>
					<Button
						size="sm"
						variant={showCustom ? "tonal-success" : "tonal"}
						className="capitalize"
						onClick={() => {
							setShowCustom(!showCustom);
						}}
					>
						Custom
					</Button>
				</nav>
				{showCustom && (
					<div className="input-group w-full grid-cols-[auto_1fr_auto]">
						<div className="ig-cell preset-filled-primary-400-600 text-xs px-3">By</div>

						<input
							className="ig-input"
							type="number"
							placeholder="1"
							min="0.01"
							step="0.01"
							value={value.toString()}
							onChange={(e) => setValue(Number.parseInt(e.currentTarget.value))}
						/>
						<div className="flex">
							<Button
								size="sm"
								variant={"tonal"}
								className="capitalize"
								onClick={() => {
									scaleMix(value, "multiply");
									setValue(0);
									setShowCustom(false);
								}}
							>
								Multiply
							</Button>
							<Button
								size="sm"
								variant={"tonal"}
								className="capitalize"
								onClick={() => {
									scaleMix(value, "divide");
									setValue(0);
									setShowCustom(false);
								}}
							>
								Divide
							</Button>
						</div>
					</div>
				)}
			</div>
		</span>
	);
}
