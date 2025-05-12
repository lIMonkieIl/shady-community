"use client";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export default function CropPlannerPlantMap() {
	return (
		<div className="card w-full overflow-hidden xl:w-[50%] bg-surface-50-950/50 p-2">
			<span className="h6 capitalize">crop locations:</span>
			<div className="p-2 flex flex-col gap-4">
				<div className="card preset-tonal overflow-hidden h-[400px]">
					<TransformWrapper
						initialScale={0.7}
						minScale={0.7}
						// maxScale={4}
						doubleClick={{ disabled: true }}
						wheel={{ step: 50 }}

						// onInit={({ setTransform }) => {
						// 	// Set a negative y value to move the image up
						// 	setTransform(50, -500, 0.5); // (x, y, scale)
						// }}
					>
						<TransformComponent>
							<img
								src="/images/ghettoMap.png"
								alt="Crop Map"
								className="w-full h-auto object-contain"
							/>
						</TransformComponent>
					</TransformWrapper>
				</div>
			</div>
		</div>
	);
}
