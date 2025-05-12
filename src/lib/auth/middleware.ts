import type { z } from "zod";

export type ActionState = {
	success: boolean;
	fields?: Record<string, string>;
	errors?: Record<string, string[]>;
};

type ValidatedActionFunction<S extends z.ZodType> = (
	data: z.infer<S>,
	formData: FormData,
) => Promise<ActionState>;

export function validatedAction<S extends z.ZodType>(
	schema: S,
	action: ValidatedActionFunction<S>,
) {
	return async (
		prevState: ActionState,
		formData: FormData,
	): Promise<ActionState> => {
		if (!(formData instanceof FormData)) {
			return {
				success: false,
				errors: { error: ["Invalid Form Data"] },
			};
		}

		const formDataObj = Object.fromEntries(formData);
		const parsed = schema.safeParse(formDataObj);

		if (!parsed.success) {
			const fieldErrors = parsed.error.flatten().fieldErrors;
			const fields: Record<string, string> = {};

			for (const key of Object.keys(formDataObj)) {
				fields[key] = formDataObj[key].toString();
			}
			return {
				success: false,
				fields,
				errors: fieldErrors as Record<string, string[]>,
			};
		}

		return action(parsed.data, formData);
	};
}
