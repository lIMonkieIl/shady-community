"use client";

import { cn } from "@/lib/utils/helpers";
import { type VariantProps, cva } from "class-variance-authority";
import { CircleCheck, CircleX, Info, OctagonAlert } from "lucide-react";
import { toast as sonnerToast } from "sonner";

export function toast(toast: Omit<ToastProps, "id">) {
	return sonnerToast.custom((id) => <Toast {...toast} id={id} />, { duration: 10000 });
}

function ToastIcon(variant: ToastProps["variant"]) {
	switch (variant) {
		case "filled-error":
		case "glass-error":
		case "outlined-error":
		case "tonal-error":
			return CircleX;

		case "filled-tertiary":
		case "glass-tertiary":
		case "outlined-tertiary":
		case "tonal-tertiary":
			return Info;
		case "filled-warning":
		case "glass-warning":
		case "outlined-warning":
		case "tonal-warning":
			return OctagonAlert;
		case "filled-success":
		case "glass-success":
		case "outlined-success":
		case "tonal-success":
			return CircleCheck;

		default:
			return Info;
	}
}

const toastVariants = cva("card flex items-center justify-baseline gap-2 p-3", {
	variants: {
		variant: {
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
		},
	},
	defaultVariants: {
		variant: "filled-tertiary",
	},
});

function Toast(props: ToastProps) {
	const { title, description, variant, className } = props;
	const Icon = ToastIcon(variant);
	return (
		<div className={cn(toastVariants({ variant }), className)}>
			<Icon />
			<div className="">
				<p className="font-bold">{title}:</p>
				<p className="text-wrap">{description}</p>
			</div>
		</div>
	);
}

type ToastProps = Omit<React.ComponentProps<"button">, "id"> &
	Omit<VariantProps<typeof toastVariants>, "id"> & {
		id: string | number;
		title: string;
		description: string;
	};
