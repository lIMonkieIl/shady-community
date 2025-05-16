// custom form component
"use client";

import {
	FormControl as FormControl_,
	FormDescription as FormDescription_,
	FormField as FormField_,
	FormItem as FormItem_,
	FormLabel as FormLabel_,
	FormMessage as FormMessage_,
	Form as Form_,
} from "@/components/shared/ui/form";
import type { FormHTMLAttributes } from "react";
import type { ControllerProps, FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/shared/ui/button";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";

type FormRootProps<T extends FieldValues> = Omit<FormHTMLAttributes<HTMLFormElement>, "action"> & {
	form: UseFormReturn<T>;
	// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
	action?: (data: T) => void | undefined;
};

function FormRoot<T extends FieldValues>(props: FormRootProps<T>) {
	const { form, action, children, className, ...rest } = props;

	const handleSubmitAction: () => void = form.handleSubmit((data: T) => {
		if (action) {
			action(data);
		}
	});

	return (
		<Form_<T> {...form}>
			<form action={handleSubmitAction} className={className} {...rest}>
				{children}
			</form>
		</Form_>
	);
}

type CustomFormFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerProps<TFieldValues, TName> & {
	label: string;
	description?: string;
};

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
	props: CustomFormFieldProps<TFieldValues, TName>,
) => {
	const { label, description, render, ...rest } = props;
	return (
		<FormField_
			{...rest}
			render={(field) => (
				<FormItem_>
					<FormLabel_>{label}</FormLabel_>
					<FormControl_>{render(field)}</FormControl_>
					{description && <FormDescription_>{description}</FormDescription_>}
					<FormMessage_ />
				</FormItem_>
			)}
		/>
	);
};

function FormHeader({
	title,
	removeBackButton = false,
	children,
}: {
	title?: string;
	removeBackButton?: boolean;
	children?: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	return (
		<div className="inline-flex gap-2 items-center">
			{!removeBackButton && (
				<Button
					onClick={() => router.push(pathname?.split("/").slice(0, -1).join("/"))}
					type="button"
					aria-label="Back"
					variant="outlined-primary"
					size="icon"
				>
					<ChevronLeft className="h-4 w-4" />
					<span className="sr-only">Back</span>
				</Button>
			)}
			{title && <legend className="font-bold text-lg">{title}</legend>}
			{children}
		</div>
	);
}

export const Form = {
	Root: FormRoot,
	Header: FormHeader,
	Field: FormField,
};

export default Form;
