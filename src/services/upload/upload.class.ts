import {
	type SequelizeAdapterOptions,
	SequelizeService,
} from "feathers-sequelize";
import type { Application } from "../../declarations";

export class Upload extends SequelizeService {
	constructor(options: SequelizeAdapterOptions, app: Application) {
		super(options);
	}
}
