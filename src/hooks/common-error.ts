// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import type { Hook, HookContext } from "@feathersjs/feathers";

export default (options = {}): Hook => {
	return async (context: HookContext): Promise<HookContext> => {
		if (context.error) {
			const { params } = context;
			const requestId = params?.requestId;
			context.error.requestId = requestId;
		}
		return context;
	};
};
