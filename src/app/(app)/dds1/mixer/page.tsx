import MixMigration from "@/components/mixer/mixMigration";
import MixerActions from "@/components/mixer/mixerActions";
import MixerDemand from "@/components/mixer/mixerDemand";
import MixerIngredientList from "@/components/mixer/mixerIngredientList";
import MixerMixBreakdown from "@/components/mixer/mixerMixBreakdown";
import MixerMixCard from "@/components/mixer/mixerMixCard";

export default function MixerPage() {
	return (
		<div className="space-y-4">
			<MixMigration />
			<MixerActions />
			<MixerIngredientList />
			<MixerDemand />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<MixerMixCard />
				<MixerMixBreakdown />
			</div>
		</div>
	);
}
