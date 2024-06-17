// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {
	DataTypes,
	type Model,
	type ModelStatic,
	type Optional,
	type Sequelize,
} from "sequelize";

import type { Application } from "../declarations";

export interface UploadAttributes {
	id: number;
	url: string;
	deletedAt: Date;
}

interface UploadCreationAttributes extends Optional<UploadAttributes, "id"> {}

/**
 * @swagger
 * components:
 *   schemas:
 *     Upload:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         url:
 *           type: string
 *         deletedAt:
 *           type: string
 *           format: date-time
 */
export default function (
	app: Application,
): ModelStatic<Model<UploadAttributes, UploadCreationAttributes>> {
	const sequelizeClient: Sequelize = app.get("sequelizeClient");
	const upload = sequelizeClient.define<
		Model<UploadAttributes, UploadCreationAttributes>
	>(
		"upload",
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				defaultValue: DataTypes.UUIDV4,
				autoIncrement: true,
				primaryKey: true,
        		allowNull: false
			},
			url: {
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
	(upload as any).associate = (models: any) => {
		// Define associations here
		// See http://docs.sequelizejs.com/en/latest/docs/associations/
	};

	return upload;
}
