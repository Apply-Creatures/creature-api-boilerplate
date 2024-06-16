import util from "node:util";
import type { HookContext } from "@feathersjs/feathers";
// A hook that logs service method before, after and error
// See https://github.com/winstonjs/winston for documentation
// about the logger.
import logger from "../logger";

// To see more detailed messages, uncomment the following line:
logger.level = "debug";

export default function () {
	return (context: HookContext) => {
		const { params } = context;
		const requestId = params.requestId;
		logger.debug(`Request Id: ${requestId}`);
		// This debugs the service call and a stringified version of the hook context
		// You can customize the message (and logger) to your needs
		logger.debug(
			`${context.type} app.service('${context.path}').${context.method}()`,
		);

		if (
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			typeof (context as any).toJSON === "function" &&
			logger.level === "debug"
		) {
			logger.debug("Hook Context", util.inspect(context, { colors: false }));
		}

		if (context.error && !context.result) {
			logger.error(context.error.stack);
		}
	};
}
