import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils/helpers";

const buttonVariants = cva("", {
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
		size: {
			sm: "btn btn-sm",
			base: "btn btn-base",
			lg: "btn btn-lg",
			"icon-sm": "btn-icon btn-icon-sm",
			icon: "btn-icon btn-icon-base",
			"icon-lg": "btn-icon btn-icon-lg",
		},
	},
	defaultVariants: {
		variant: "filled",
		size: "base",
	},
});

function Button({
	className,
	variant,
	size,
	type,
	unstyled,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
		unstyled?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={
				unstyled ? className : cn(buttonVariants({ variant, size, className }))
			}
			type={type ?? "button"}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
