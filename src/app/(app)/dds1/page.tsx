"use client";
import { navigationItems } from "@/components/dds1/dds1MenuDrawer";
import Link from "next/link";

export default function Home() {
	return (
		<div className="">
			<Link
				prefetch
				href={navigationItems.find((n) => n.name === "Crop Planner")?.href ?? ""}
				className="card w-fit block theme-decorated preset-filled-surface-100-900 border-[1px] border-surface-200-800 card-hover divide-surface-200-800"
			>
				<div className="max-w-md divide-y overflow-hidden">
					{/* Article */}
					<article className="space-y-4 p-4">
						<div>
							<h2 className="h6">Woops</h2>
							<h3 className="h3">This page is not finished yet!</h3>
						</div>
						<p className="opacity-60">
							Please use the menu button (top left) or click me to go to the crop planner
						</p>
					</article>
				</div>
			</Link>
		</div>
	);
}
