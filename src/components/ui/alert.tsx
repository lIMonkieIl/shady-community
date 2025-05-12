import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils/helpers";

const alertVariants = cva(
	"relative w-full rounded-container px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
	{
		variants: {
			variant: {
				filled: "preset-filled",
				glass: "preset-glass",
				outlined: "preset-outlined",
				tonal: "preset-tonal",

				"filled-primary": "preset-filled-primary-400-600",
				"glass-primary": "preset-glass-primary",
				"outlined-primary": "preset-outlined-primary-400-600",
				"tonal-primary": "preset-tonal-primary",

				"filled-secondary": "preset-filled-secondary-400-600",
				"glass-secondary": "preset-glass-secondary",
				"outlined-secondary": "preset-outlined-secondary-400-600",
				"tonal-secondary": "preset-tonal-secondary",

				"filled-tertiary": "preset-filled-tertiary-400-600",
				"glass-tertiary": "preset-glass-tertiary",
				"outlined-tertiary": "preset-outlined-tertiary-400-600",
				"tonal-tertiary": "preset-tonal-tertiary",

				"filled-success": "preset-filled-success-400-600",
				"glass-success": "preset-glass-success",
				"outlined-success": "preset-outlined-success-400-600",
				"tonal-success": "preset-tonal-success",

				"filled-warning": "preset-filled-warning-400-600",
				"glass-warning": "preset-glass-warning",
				"outlined-warning": "preset-outlined-warning-400-600",
				"tonal-warning": "preset-tonal-warning",

				"filled-error": "preset-filled-error-400-600",
				"glass-error": "preset-glass-error",
				"outlined-error": "preset-outlined-error-400-600",
				"tonal-error": "preset-tonal-error",

				"filled-surface": "preset-filled-surface-400-600",
				"glass-surface": "preset-glass-surface",
				"outlined-surface": "preset-outlined-surface-400-600",
				"tonal-surface": "preset-tonal-surface",
			},
		},
		defaultVariants: {
			variant: "filled",
		},
	},
);

type AlertProps = React.ComponentProps<"div"> &
	VariantProps<typeof alertVariants>;

function Alert({ className, variant, ...props }: AlertProps) {
	return (
		<div
			data-slot="alert"
			role="alert"
			className={cn(alertVariants({ variant }), className)}
			{...props}
		/>
	);
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-title"
			className={cn(
				"col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
				className,
				"preset",
			)}
			{...props}
		/>
	);
}

function AlertDescription({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-description"
			className={cn(
				"text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
				className,
			)}
			{...props}
		/>
	);
}

export { Alert, AlertTitle, AlertDescription };
