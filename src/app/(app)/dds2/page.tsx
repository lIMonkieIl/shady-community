"use client";
import Link from "next/link";

export default function Home() {
	return (
		<div className="">
			<Link
				prefetch
				href="/cropplanner"
				className="card w-fit block theme-decorated preset-filled-surface-100-900 border-[1px] border-surface-200-800 card-hover divide-surface-200-800"
			>
				<div className="max-w-md divide-y overflow-hidden">DDS2</div>
			</Link>
		</div>
	);
}
