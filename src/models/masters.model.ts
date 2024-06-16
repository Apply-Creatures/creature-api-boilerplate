// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {
	DataTypes,
	type Model,
	type ModelStatic,
	type Optional,
	type Sequelize,
} from "sequelize";

import { v4 as uuidv4 } from "uuid";

import type { Application } from "../declarations";

export interface MasterAttributes {
	id: number;
	text: string;
	deletedAt: Date;
}

interface MasterCreationAttributes extends Optional<MasterAttributes, "id"> {}

/**
 * @swagger
 * components:
 *   schemas:
 *     Master:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         text:
 *           type: string
 *         deletedAt:
 *           type: string
 *           format: date-time
 */
export default function (
	app: Application,
): ModelStatic<Model<MasterAttributes, MasterCreationAttributes>> {
	const sequelizeClient: Sequelize = app.get("sequelizeClient");
	const masters = sequelizeClient.define<
		Model<MasterAttributes, MasterCreationAttributes>
	>(
		"masters",
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				defaultValue: uuidv4(),
				autoIncrement: true,
				primaryKey: true,
				allowNull: false
			},
			text: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			deletedAt: {
				type: DataTypes.DATE,
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
	(masters as any).associate = (models: any) => {
		// Define associations here
		// See http://docs.sequelizejs.com/en/latest/docs/associations/
	};

	return masters;
}
