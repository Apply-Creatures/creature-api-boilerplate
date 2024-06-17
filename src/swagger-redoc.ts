import swaggerJSDoc, { type Response } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Application } from "./declarations";

const swaggerDefinition = {
	openapi: "3.0.0",
	info: {
		title: "Apply Creatures APIs",
		version: "1.0.0",
		description:
			"This is the OpenAPI docs of this server, you may try out any endpoint from here. You may create a user, then authenticate, to be able to invoke protected endpoints. There is also RedDoc, which is generated from the swagger spec",
	},
};

const options = {
	swaggerDefinition,
	apis: ["./src/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default (app: Application): void => {
	app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	// Redoc setup
	app.use("/redoc", (_: Request, res: Response) => {
		res.send(`
        <!doctype html>
        <html>
          <head>
            <title>ReDoc</title>
            <!-- needed for adaptive design -->
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <!--
            ReDoc doesn't change outer page styles
            -->
            <style>
              body {
                margin: 0;
                padding: 0;
              }
            </style>
          </head>
          <body>
            <redoc spec-url='/api-docs/swagger.json'></redoc>
            <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
          </body>
        </html>
      `);
	});

	// Serve the Swagger JSON
	app.get("/api-docs/swagger.json", (req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});
};
