"use client";

import { CircleCheck, CircleX, Info, OctagonAlert } from "lucide-react";
import { toast as sonnerToast } from "sonner";

export function toast(toast: Omit<ToastProps, "id">) {
	return sonnerToast.custom(
		(id) => <Toast type={toast.type} id={id} title={toast.title} description={toast.description} />,
		{ duration: 10000 },
	);
}

function ToastIcon(type: ToastProps["type"]) {
	switch (type) {
		case "error":
			return CircleX;

		case "info":
			return Info;
		case "warn":
			return OctagonAlert;
		case "success":
			return CircleCheck;
	}
}

function Toast(props: ToastProps) {
	const { title, description, type } = props;
	const color = `preset-tonal-${type} preset-outlined-${type}-400-600`;
	const Icon = ToastIcon(type);
	return (
		<div className={`card flex items-center justify-baseline gap-2 p-3 ${color}`}>
			<Icon />
			<div className="">
				<p className="font-bold">{title}:</p>
				<p className="text-wrap">{description}</p>
			</div>
		</div>
	);
}

interface ToastProps {
	type: "error" | "warn" | "info" | "success";
	id: string | number;
	title: string;
	description: string;
}
