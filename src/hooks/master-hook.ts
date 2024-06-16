// Use this hook to manipulate incoming or outgoing data.
import type { HookContext } from "@feathersjs/feathers";
import logger from "../logger";
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
function recursive(i: number) {
	setTimeout(() => {
		logger.debug(`My Itteration ${i}`);
		i++;
		if (i < 50) {
			recursive(i);
		}
	}, 5000);
}

export default function (options = {}) {
	return async (context: HookContext) => {
		const { method, type } = context;
		if (method === "find" && type === "before") {
			logger.info("oh... You need this loop?");
			const i = 0;
			recursive(i);
		}
		return context;
	};
}
