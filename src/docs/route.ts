import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";
import path from "path";

export default function docs(app: Express) {
  app.use("/docs-public", express.static(path.join(__dirname, "public")));
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerOutput, {
      customCssUrl: "/docs-public/swagger-ui.css",
      customJs: "/docs-public/swagger-ui-bundle.js",
    })
  );
}
