import { use$ } from "@legendapp/state/react";

export default function StateDebugger({ state }: { state: unknown }) {
	return (
		<pre className="pre rounded-container  border-4 border-warning-400-600">
			{JSON.stringify(use$(state), null, 2)}
		</pre>
	);
}
