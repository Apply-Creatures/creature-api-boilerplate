import {
	type AuthenticationResult,
	AuthenticationService,
	JWTStrategy,
} from "@feathersjs/authentication";
import { LocalStrategy } from "@feathersjs/authentication-local";
import type { Params } from "@feathersjs/feathers";

import type { JsonObject } from "swagger-ui-express";
import type { Application } from "./declarations";
import logger from "./logger";

declare module "./declarations" {
	interface AuthServiceTypes {
		authentication: AuthenticationService;
	}
}

class MyAuthenticationService extends AuthenticationService {
	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     User:
	 *       type: object
	 *       properties:
	 *         id:
	 *           type: string
	 *         username:
	 *           type: string
	 *         email:
	 *           type: string
	 *         role:
	 *           type: string
	 *         createdAt:
	 *           type: string
	 *         updatedAt:
	 *           type: string
	 *       required:
	 *         - id
	 *         - username
	 *         - email
	 *         - role
	 *         - createdAt
	 *         - updatedAt
	 *     AuthenticationStrategy:
	 *       type: object
	 *       properties:
	 *         strategy:
	 *           type: string
	 *       required:
	 *         - strategy
	 *     AuthResultAuthentication:
	 *       type: object
	 *       properties:
	 *         strategy:
	 *           type: string
	 *       required:
	 *         - strategy
	 *     AuthResultPayload:
	 *       type: object
	 *       properties:
	 *         authentication:
	 *           $ref: '#/components/schemas/AuthResultAuthentication'
	 *         user:
	 *           $ref: '#/components/schemas/User'
	 *       required:
	 *         - authentication
	 *         - user
	 *     AuthenticationPayload:
	 *       type: object
	 *       properties:
	 *         authResult:
	 *           $ref: '#/components/schemas/AuthResultPayload'
	 *         iat:
	 *           type: integer
	 *         exp:
	 *           type: integer
	 *         aud:
	 *           type: string
	 *         iss:
	 *           type: string
	 *         jti:
	 *           type: string
	 *       required:
	 *         - authResult
	 *         - iat
	 *         - exp
	 *         - aud
	 *         - iss
	 *         - jti
	 *     Authentication:
	 *       type: object
	 *       properties:
	 *         strategy:
	 *           type: string
	 *         payload:
	 *           $ref: '#/components/schemas/AuthenticationPayload'
	 *       required:
	 *         - strategy
	 *         - payload
	 *     AuthResult:
	 *       type: object
	 *       properties:
	 *         accessToken:
	 *           type: string
	 *         authentication:
	 *           $ref: '#/components/schemas/Authentication'
	 *         user:
	 *           $ref: '#/components/schemas/User'
	 *       required:
	 *         - accessToken
	 *         - authentication
	 *         - user
	 */
	async getPayload(
		authResult: AuthenticationResult,
		params: Params,
	): Promise<AuthenticationResult> {
		// Call original `getPayload` first
		const payload = await super.getPayload(authResult, params);

		if (!authResult) {
			throw new Error("No AuthenticationResult found");
		}

		return Object.assign(payload, {
			authResult: replaceUndefinedKeys(authResult),
		});
	}
}

type JsonValue = string | number | boolean | JsonObject | JsonArray | null;

type JsonArray = JsonValue[];

// That's some unfortunate hack! Unsolved mystery: AuthenticationResult for some reasons..
// places undefined keys. I couldn't see why and found it  safe to just replace with user key
// until I find the culprit/reason
const replaceUndefinedKeys = (
	obj: AuthenticationResult,
): AuthenticationResult => {
	if (obj && typeof obj === "object") {
		Object.keys(obj).forEach((key) => {
			const value = obj[key];
			if (typeof value === "object" && value !== null) {
				replaceUndefinedKeys(value as AuthenticationResult);
			}
			if (key === "undefined") {
				obj.user = value;
				delete obj[key];
			}
		});
	}
	return obj;
};

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication management
 */

/**
 * @swagger
 * /authentication:
 *   post:
 *     summary: Authenticate a user. Make sure to create that user first
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - strategy
 *               - email
 *               - password
 *             properties:
 *               strategy:
 *                 type: string
 *                 enum: [local, jwt]  # Set enum values for strategy
 *                 default: local      # Set default value to "local"
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResult'

 *              
 */
export function configureStrategies(app: Application): void {
	logger.info("configuring local and jwt strategies");
	const authentication = new MyAuthenticationService(app);

	authentication.register("jwt", new JWTStrategy());

	app.use("authentication", authentication);
	// Ensure settings are correctly applied to the authentication service
	app.set("authentication", {
		secret: app.get("authentication").secret || "1234",
		strategies: ["jwt", "local"],
		authStrategies: ["jwt", "local"], // Ensure this line is included
		service: "users",
		path: "/authentication",
		local: {
			usernameField: "email", // or 'username' based on your user model
			passwordField: "password",
		},
	});

	authentication.register("local", new LocalStrategy());

	// Optionally, reconfigure the authentication service to ensure it picks up the settings
	// im not sure about this, it does get picked and fails if we set it.
	//app.configure(authentication);
}

export default configureStrategies;
