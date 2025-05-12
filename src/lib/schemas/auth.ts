import { z } from "zod";

export const signInSchema = z.object({
	email: z.string().trim().min(2, "2 or more char").email(), // Trimming to remove unwanted spaces
	password: z.string().trim().min(8, "min char is 8"), // Trimming to remove unwanted spaces
});
export const signUpSchema = z
	.object({
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});
