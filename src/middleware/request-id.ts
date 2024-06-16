import type { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export default () => {
	return (req: Request, res: Response, next: NextFunction) => {
		const requestId = uuidv4();
		if (!req.feathers) {
			req.feathers = {};
		}
		req.feathers.requestId = requestId;
		next();
	};
};
