import type React from "react";

interface DividerWithTextProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export function DividerWithText({ children, className = "", ...props }: DividerWithTextProps) {
	return (
		<div
			className={`flex items-center gap-2 text-sm text-tertiary-400-600 ${className}`}
			{...props}
		>
			<div className="flex-1 w-fit border-t border-border border-tertiary-400-600" />
			<span>{children}</span>
			<div className="flex-1 border-t border-border border-tertiary-400-600" />
		</div>
	);
}
