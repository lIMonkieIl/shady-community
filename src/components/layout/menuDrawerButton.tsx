"use client";

import { uiState$ } from "@/lib/state/local/uiState";
import { Menu as IconMenu } from "lucide-react";
import { Button } from "../shared/ui/button";

export function MenuDrawerButton() {
	return (
		<Button
			onClick={() => uiState$.drawer.open()}
			type="button"
			size={"icon"}
			variant={"tonal"}
			className="theme-decorated"
		>
			<IconMenu size={18} />
		</Button>
	);
}
