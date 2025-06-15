"use client";

import { useMixManager } from "@/hooks/useMixManger";
import StateDebugger from "../shared/debugState";

export default function MixerData() {
	const { state } = useMixManager();
	return (
		<div className="flex flex-col">
			<StateDebugger state={state} />
		</div>
	);
}
