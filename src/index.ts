import type { Server } from "node:http";
import app from "./app";
import logger from "./logger";

const port = app.get("port") || 3030;
const host = app.get("host") || "localhost";

const task = app.listen(port);

process.on("unhandledRejection", (reason, p) => {
	logger.error(`odd rejection ${reason}`);
	logger.error("Unhandled Rejection at: Promise ", p, reason);
});

logger.info("Once task is ready...");
task.then((server: Server) => {
	logger.info("Feathers application started on http://%s:%d", host, port);
});
