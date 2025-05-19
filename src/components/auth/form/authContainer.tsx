import WordCommunitySVG from "@/components/logos/WordCommunity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/ui/avatar";

import Image from "next/image";
import Link from "next/link";
import WordShadySVG from "../../logos/WordShady";

export default function AuthContainer({ children }: React.ComponentProps<"div">) {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex  flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<Link href="/" className="flex items-center gap-2 font-medium">
						<Avatar className="size-10">
							<AvatarImage className="theme-decorated" src={"/images/icon-512-maskable.png"} />
							<AvatarFallback className="bg-secondary-400-600">sc</AvatarFallback>
						</Avatar>
						Shady Community.
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">{children}</div>
				</div>
			</div>
			<div className="relative hidden lg:block h-screen w-full">
				<div className="absolute h-full w-full flex items-end justify-center bottom-20 left-0 right-0 z-10">
					<div>
						<WordShadySVG
							className="fill-primary-500 right-3 -rotate-3 relative h-28 top-1 stroke-surface-950-50 stroke-3 "
							style={{
								filter: "drop-shadow(2px 2px 10px var(--color-secondary-500))",
							}}
						/>
						<WordCommunitySVG
							className="fill-primary-500 rotate-2 relative h-24 bottom-1 stroke-surface-950-50 stroke-3"
							style={{
								filter: "drop-shadow(2px 2px 10px var(--color-secondary-500))",
							}}
						/>
					</div>
				</div>

				<Image
					src="/images/logo-bg1.jpg"
					alt="Background"
					fill
					priority
					loading="eager"
					className="brightness-75 absolute inset-0 h-full w-full object-cover"
				/>
			</div>
		</div>
	);
}
