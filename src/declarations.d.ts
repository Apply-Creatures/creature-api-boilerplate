import type { Sequelize } from "sequelize";
import "@feathersjs/transport-commons";
import type { Application as ExpressFeathers } from "@feathersjs/express";
import type { HookContext as FeathersHookContext } from "@feathersjs/feathers";

import '@feathersjs/feathers';


export interface Configuration {
	// Put types for app.get and app.set here
	port: number;
	host: string;
	postgres: string;
	sequelizeClient: Sequelize;
	public: string;
	bucketName: string;
	paginate: {
		default: number;
		max: number;
	};
}
// A mapping of service names to types. Will be extended in service files.
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type ServiceTypes = {};

// The application instance type that will be used everywhere else
//export type Application = ExpressFeathers<ServiceTypes, Configuration>;
export type HookContext = FeathersHookContext<Application>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Application = FeathersApplication<{ [key: string]: any }>;