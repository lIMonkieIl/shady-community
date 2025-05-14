import { Loader2 } from "lucide-react";

export default function Loading() {
	// You can add any UI inside Loading, including a Skeleton.
	return (
		<div className="flex justify-center h-screen items-center gap-2">
			<Loader2 size={70} className="animate-spin text-primary-400-600" />
		</div>
	);
}
