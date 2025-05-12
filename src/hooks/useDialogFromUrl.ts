import { uiState$ } from "@/lib/state/local/uiState";
import { useSearchParams } from "next/navigation";

export const useDialogFromUrl = (key: string) => {
	const searchParams = useSearchParams();
	const param = searchParams.get("dialog");
	const isOpen = param === key;

	const setOpen = (open: boolean) => {
		const newParams = new URLSearchParams(searchParams);
		if (open) {
			newParams.set("dialog", key);
			uiState$.drawer.close();
		} else {
			newParams.delete("dialog");
		}
		window.history.pushState(null, "", `?${newParams.toString()}`);
	};

	return [isOpen, setOpen] as const;
};
