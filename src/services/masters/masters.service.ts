// Initializes the `masters` service on path `/masters`
import type { Application } from "../../declarations";
import logger from "../../logger";
import createModel from "../../models/masters.model";
import { Masters } from "./masters.class";
import hooks from "./masters.hooks";

declare module "../../declarations" {
	interface MastersServiceTypes {
		masters: Masters;
	}
}

/**
 * @swagger
 * tags:
 *   name: Masters
 *   description: Masters management
 */

/**
 * @swagger
 * /masters:
 *   get:
 *     summary: Retrieve a list of masters
 *     tags: [Masters]
 *     responses:
 *       200:
 *         description: A list of masters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Master'
 */
export default function (app: Application): void {
	const Model = createModel(app);
	const paginate = app.get("paginate");

	const options = {
		Model,
		paginate,
	};

	// Initialize our service with any options it requires
	app.use("masters", new Masters(options, app));

	// Get our initialized service so that we can register hooks
	const service = app.service("masters");

	service.hooks(hooks);
	logger.info("Masters service is hooked");
}
