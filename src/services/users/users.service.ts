// Initializes the `users` service on path `/users`
import type { Application } from "../../declarations";
import logger from "../../logger";
import createModel from "../../models/users.model";
import { Users } from "./users.class";
import hooks from "./users.hooks";

// Add this service to the service type index
declare module "../../declarations" {
	interface UserServiceTypes {
		users: Users;
	}
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
export default function (app: Application): void {
	const options = {
		Model: createModel(app),
		paginate: app.get("paginate"),
	};

	// Initialize our service with any options it requires
	app.use("users", new Users(options, app));

	// Get our initialized service so that we can register hooks
	const service = app.service("users");

	service.hooks(hooks);
	logger.info("User service is hooked");
}
