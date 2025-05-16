import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const actionClient = createSafeActionClient({
	defineMetadataSchema() {
		return z.object({
			actionName: z.string(),
			description: z.string(),
		});
	},
	handleServerError(error, utils) {
		const { clientInput, metadata } = utils;
		console.log("SERVER_ERROR: ", {
			message: error.message,
			metadata,
			clientInput,
		});
		return error.message;
	},
});
