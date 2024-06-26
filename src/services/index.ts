import configureStrategies from "../authentication";
import type { Application } from "../declarations";
import masters from "./masters/masters.service";
import upload from "./upload/upload.service";
import users from "./users/users.service";

export function configureAllServices(app: Application): void {
	app.configure(masters);
	app.configure(upload);
	app.configure(users);
}

export default configureAllServices;
