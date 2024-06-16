import type { Namespace } from "cls-hooked";
import type { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

function correlation(namespace: Namespace) {
	return (req: Request, res: Response, next: NextFunction) => {
		const correlationId = uuidv4();
		if (!req.feathers) {
			req.feathers = {};
		}
		req.feathers.correlationId = correlationId;
		namespace.run(() => {
			namespace.set("correlationId", correlationId);
			next();
		});
	};
}
export default correlation;
