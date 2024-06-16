import path from "node:path";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import favicon from "serve-favicon";
import { configureAllServices } from './services/index';

import express, {
	errorHandler,
	json,
	notFound,
	urlencoded,
	serveStatic,
	rest,
} from "@feathersjs/express";

import { feathers } from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio";

import appHooks from "./app.hooks";
import { configureStrategies } from "./authentication";
import channels from "./channels";
import type { Application } from "./declarations";
import logger from "./logger";
import middleware from "./middleware";
import {setupSequelize} from "./sequelize";
import docSetup from './swagger-redoc'; // Adjust the import path accordingly

const app: Application = express(feathers());

// Configure Swagger and ReDoc
docSetup(app);

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(favicon(path.join("public", "favicon.ico")));

// Host the public folder
app.use("/", serveStatic("public"));

// Set up Plugins and providers
app.configure(rest());
app.configure(socketio());

configureStrategies(app);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
//app.configure(authentication);

// Set up event channels (see channels.js)
app.configure(channels);


setupSequelize(app);

// Set up our services (see `services/index.js`)
configureAllServices(app);


// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(errorHandler({ logger, html: false }));

logger.info("setting hooks...");
app.hooks(appHooks);

export default app;
