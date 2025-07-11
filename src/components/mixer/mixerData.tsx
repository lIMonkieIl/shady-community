"use client";

import { useMixManager } from "@/hooks/useMixManager";
import { useMixesManager } from "@/hooks/useMixesManager";
import StateDebugger from "../shared/debugState";

export default function MixerData() {
	const {
		state: { currentMixData },
	} = useMixManager();
	const {
		state: { mixes, recipes },
	} = useMixesManager();
	return (
		<div className="flex flex-col">
			<StateDebugger state={currentMixData} />
			<StateDebugger state={mixes} />
			<StateDebugger state={recipes} />
		</div>
	);
}
