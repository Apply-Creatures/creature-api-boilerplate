import { uploadHook } from "@bervproject/feathers-advance-hook";
import * as feathersAuthentication from "@feathersjs/authentication";
import { iff, isProvider, softDelete } from "feathers-hooks-common";
import type { HookContext } from "../../declarations";
const { authenticate } = feathersAuthentication.hooks;

export default {
	before: {
		all: [
			iff(isProvider("external"), authenticate("jwt")),
			softDelete({
				// context is the normal hook context
				deletedQuery: async (context: HookContext) => {
					return { deletedAt: null };
				},
				removeData: async (context: HookContext) => {
					return { deletedAt: new Date() };
				},
			}),
		],
		find: [],
		get: [],
		create: [uploadHook()],
		update: [],
		patch: [],
		remove: [],
	},

	after: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: [],
	},

	error: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: [],
	},
};
