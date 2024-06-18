// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {
	DataTypes,
	type Model,
	type ModelStatic,
	type Optional,
	type Sequelize,
} from "sequelize";

import { UUID } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import type { Application } from "../declarations";

export interface UserAttributes {
	id: string;
	username: string;
	email: string;
	password?: string;
	role: string;
	createdAt?: string; // ISO date string
	updatedAt?: string; // ISO date string
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         role:
 *           type: string
 *       required:
 *         - username
 *         - email
 *         - password
 *         - role
 */
export default function (
	app: Application,
): ModelStatic<Model<UserAttributes, UserCreationAttributes>> {
	const sequelizeClient: Sequelize = app.get("sequelizeClient");
	const users = sequelizeClient.define<
		Model<UserAttributes, UserCreationAttributes>
	>(
		"users",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: uuidv4(),
				primaryKey: true,
				unique: true,
				allowNull: false,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			hooks: {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				beforeCount(options: any) {
					options.raw = true;
				},
			},
		},
	);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	(users as any).associate = (models: any) => {
		// Define associations here
		// See http://docs.sequelizejs.com/en/latest/docs/associations/
	};

	return users;
}
