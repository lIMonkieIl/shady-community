import CropPlannerActions from "@/components/cropplanner/cropPlannerActions";
import CropPlannerCosts from "@/components/cropplanner/cropPlannerCosts";
import CropPlannerProfit from "@/components/cropplanner/cropPlannerProfit";
import CropPlannerSetup from "@/components/cropplanner/cropPlannerSetup";
import CropPlannerYieldSingle from "@/components/cropplanner/cropPlannerYieldSingle";
import CropPlannerPlantMap from "../../components/cropplanner/cropPlannerPlantMap";
import CropPlannerYieldCrop from "../../components/cropplanner/cropPlannerYieldCrop";

export default function CropPlanner() {
	return (
		<div className=" flex flex-col gap-4 md:flex-row">
			<div className="gap-4 flex flex-col xl:flex-row md:w-[50%]">
				<CropPlannerActions />
				<CropPlannerSetup />
			</div>
			<div className="gap-4 flex md:w-[50%] flex-col">
				<div className="flex flex-col gap-4 xl:flex-row">
					<CropPlannerYieldSingle />
					<CropPlannerYieldCrop />
				</div>

				<div className="flex flex-col gap-4 xl:flex-row">
					<CropPlannerCosts />
					<CropPlannerProfit />
				</div>
			</div>
			{/* <CropPlannerPlantMap /> */}
		</div>
	);
}
