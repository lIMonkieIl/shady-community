import { Loader2 } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./button";

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
	pendingText?: string;
	showLoadingIcon?: boolean;
}

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
	(
		{
			children,
			className,
			variant = "filled-primary",
			pendingText,
			disabled,
			showLoadingIcon = true,
			...props
		},
		ref,
	) => {
		const { pending } = useFormStatus();

		return (
			<Button
				ref={ref}
				type="submit"
				variant={variant}
				className={className}
				disabled={pending || disabled}
				{...props}
			>
				{pending ? (
					<div className="flex items-center gap-2">
						{showLoadingIcon && <Loader2 className="h-4 w-4 animate-spin" />}
						{pendingText || children}
					</div>
				) : (
					children
				)}
			</Button>
		);
	},
);

SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
