"use client";

import { cn } from "@/lib/utils/helpers";
import { Progress } from "@skeletonlabs/skeleton-react";
import { type VariantProps, cva } from "class-variance-authority";
import { CircleCheck, CircleX, Info, OctagonAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast as sonnerToast } from "sonner";
const DEFAULT_DURATION = 10000;

export function toast(toast: ToastProps) {
	return sonnerToast.custom((id) => <Toast {...toast} id={toast.id ?? id} />, {
		duration: DEFAULT_DURATION,
	});
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
		case "filled-surface":
		case "glass-surface":
		case "outlined-surface":
		case "tonal-surface":
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

			"filled-surface": "preset-filled-surface-400-600",
			"glass-surface": "preset-glass-surface",
			"outlined-surface": "preset-outlined-surface-400-600",
			"tonal-surface": "preset-tonal-surface",
		},
	},
	defaultVariants: {
		variant: "filled-tertiary",
	},
});

const progressBarVariants = cva("", {
	variants: {
		variant: {
			"filled-tertiary": "bg-tertiary-contrast-400-600/60",
			"glass-tertiary": "bg-tertiary-400-600/60",
			"outlined-tertiary": "bg-tertiary-400-600/40",
			"tonal-tertiary": "bg-tertiary-400-600/30",

			"filled-success": "bg-success-contrast-400-600/60",
			"glass-success": "bg-success-400-600/60",
			"outlined-success": "bg-success-400-600/40",
			"tonal-success": "bg-success-400-600/30",

			"filled-warning": "bg-warning-contrast-400-600/60",
			"glass-warning": "bg-warning-400-600/60",
			"outlined-warning": "bg-warning-400-600/40",
			"tonal-warning": "bg-warning-400-600/30",

			"filled-error": "bg-error-contrast-400-600/60",
			"glass-error": "bg-error-400-600/60",
			"outlined-error": "bg-error-400-600/40",
			"tonal-error": "bg-error-400-600/30",

			"filled-surface": "bg-surface-contrast-400-600/60",
			"glass-surface": "bg-surface-400-600/60",
			"outlined-surface": "bg-surface-400-600/40",
			"tonal-surface": "bg-surface-400-600/30",
		},
	},
	defaultVariants: {
		variant: "filled-tertiary",
	},
});

function Toast(props: ToastProps) {
	const { title, description, variant, className, id, children } = props;
	const Icon = ToastIcon(variant);
	const dismiss = () => sonnerToast.dismiss(id);

	const [remaining, setRemaining] = useState(DEFAULT_DURATION);
	const [hovered, setHovered] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		let start = Date.now();
		let timeout: NodeJS.Timeout;
		let interval: NodeJS.Timeout;

		function tick() {
			const elapsed = Date.now() - start;
			setRemaining((prev) => Math.max(0, prev - elapsed));
			start = Date.now();
		}

		if (!hovered) {
			interval = setInterval(tick, 100);
			timeout = setTimeout(() => dismiss(), remaining);
		}

		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [hovered]);

	return (
		<div
			className={cn("relative overflow-hidden", toastVariants({ variant }), className)}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<Icon />
			<div>
				<p className="font-bold">{title}:</p>
				<p className="text-wrap">{description}</p>

				{typeof children === "function" ? children({ dismiss }) : children}
			</div>
			<div className="absolute bottom-0 left-0 right-0">
				<Progress
					meterRounded="rounded-none rounded-r-container"
					trackRounded="rounded-none"
					trackBg="bg-transparent"
					value={remaining}
					max={DEFAULT_DURATION}
					meterBg={
						// "bg-error-400-600/30"
						progressBarVariants({ variant })
					}
				/>
			</div>
		</div>
	);
}

type ToastChildren = React.ReactNode | ((props: { dismiss: () => void }) => React.ReactNode);

type ToastProps = Omit<React.ComponentProps<"button">, "id" | "children"> &
	Omit<VariantProps<typeof toastVariants>, "id"> & {
		id?: string | number;
		title: string;
		description: string;
		children?: ToastChildren;
	};
