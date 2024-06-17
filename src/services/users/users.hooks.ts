import * as feathersAuthentication from "@feathersjs/authentication";
import * as local from "@feathersjs/authentication-local";
import { Forbidden, NotAuthenticated } from "@feathersjs/errors";

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
	before: {
		all: [],
		find: [authenticate("jwt")],
		get: [authenticate("jwt")],
		create: [hashPassword("password")],
		update: [hashPassword("password"), authenticate("jwt")],
		patch: [hashPassword("password"), authenticate("jwt")],
		remove: [authenticate("jwt")],
	},

	after: {
		all: [
			// Make sure the password field is never sent to the client
			// Always must be the last hook
			protect("password"),
		],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: [],
	},

	error: {
		all: [
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			async (context: any) => {
				if (context.error instanceof NotAuthenticated) {
					// Return a custom response for NotAuthenticated error
					return {
						statusCode: 401,
						message: "You are not authenticated",
					};
					// biome-ignore lint/style/noUselessElse: <explanation>
				} else if (context.error.code === 403) {
					// Return a custom response for Forbidden error
					return {
						statusCode: 403,
						message: "You are not authorized to access this",
					};
				}
			},
		],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: [],
	},
};
