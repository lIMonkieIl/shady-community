"use client";
import { use$, useObservable } from "@legendapp/state/react";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

const games = [
	{
		value: "dds1",
		title: "Drug Dealer Simulator 1",
	},
	{
		value: "dds2",
		title: "Drug Dealer Simulator 2",
	},
];

export default function GameSelect() {
	const router = useRouter();
	const pathname = usePathname();
	const current = games.find((game) => game.value === pathname.split("/")[1]); // e.g. "/dds1" => "dds1"
	const open = useObservable(false);
	const isOpen = use$(open);

	return (
		<Select
			value={current?.value}
			open={isOpen}
			onOpenChange={(isOpen) => open.set(isOpen)}
			onValueChange={(value) => {
				if (value !== current?.value) {
					router.push(`/${value}`);
				}
			}}
		>
			<div className="relative">
				<SelectTrigger className=" btn w-full justify-between flex preset-outlined-surface-200-800 theme-decorated decorator-top-right focus:preset-outlined-primary-500 hover:preset-tonal">
					<div className="space-x-1">
						<span className="font-semibold">Game:</span>
						<span className="">{current?.title}</span>
					</div>
					<ChevronDown className="h-4 w-4 text-primary-500 opacity-50" />
				</SelectTrigger>
				{/* <div className="absolute top-0 right-0 font-semibold animate-bounce rotate-12 chip preset-filled">
					Soon
				</div> */}
			</div>
			<SelectContent
				className="card preset-filled-surface-50-950 preset-outlined-primary-50-950 overflow-y-auto"
				style={{ maxHeight: "min(50vh, 345px)" }}
			>
				<div className="pl-3 py-1 font-bold">
					<span>Games</span>
				</div>
				<div className="space-y-1">
					{games.map((game) => {
						return (
							<SelectItem
								key={game.value}
								value={game.value}
								className={`hover:preset-tonal ${current?.value === game.value ? "preset-filled-primary-400-600" : ""} card`}
							>
								{game.title}
							</SelectItem>
						);
					})}
				</div>
			</SelectContent>
		</Select>
	);
}
