import type { ReactNode } from "react";
import { cn } from "../../lib/utils/helpers";

type PageContainerProps = {
	children: ReactNode;
	className?: string;
};

export default function PageContainer({ children, className = "" }: PageContainerProps) {
	return (
		<main
			className={cn("mx-auto py-4 px-4 sm:px-6 lg:px-8 max-w-screen-xl overflow-hidden", className)}
		>
			{children}
		</main>
	);
}
