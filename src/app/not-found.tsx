import { Button } from "@/components/shared/ui/button";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex-centered w-screen h-screen">
			<div className="card preset-outlined-error-400-600 p-5 space-y-4">
				<div>
					<h2 className="font-bold h5">Not Found</h2>
					<p>Could not find requested resource</p>
				</div>
				<div className="flex justify-end">
					<Button asChild className="" variant={"filled-primary"}>
						<Link href="/">Return Home</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
