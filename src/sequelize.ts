import { Sequelize } from "sequelize";
import type { Application } from "./declarations";
import logger from "./logger";

export function setupSequelize (app: Application): void {

	const dialect = 'postgres'; // Or your dialect name

	const connectionUrl = "postgres://postgres:@localhost:5432/feathersjs_boilerplate";
	const connectionString = connectionUrl; // "postgres";
	const sequelize = new Sequelize(connectionString, {
		dialect: dialect,
		logging: false,
		define: {
			freezeTableName: true,
		}
	});

	logger.info("About to check authenticate...");
	sequelize.authenticate()
    .then(() => {
      logger.info('Connection has been established successfully.');
    })
    .catch(err => {
      logger.error('Unable to connect to the database:', err);
      process.exit(1);
    });

	const oldSetup = app.setup;

	logger.info("Setting sequelizeClient...");

	app.set("sequelizeClient", sequelize);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	app.setup = function (...args: any) {
		const result = oldSetup.apply(this, args);

		// Set up data relationships
		const models = sequelize.models;
		// biome-ignore lint/complexity/noForEach: <explanation>
		Object.keys(models).forEach((name) => {
			if ("associate" in models[name]) {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(models[name] as any).associate(models);
			}
		});

		logger.info("About to sync DB...");

		sequelize.sync()
			.then(() => {
				logger.info('Database synchronized successfully.');
			})
			.catch(err => {
				logger.error('Failed to synchronize database:', err);
				process.exit(1);
			});

		return result;
	};

}
