import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";
import fs from "fs";

export default function docs(app: Express) {
  const cssPath = require.resolve("swagger-ui-dist/swagger-ui.css");
  const css = fs.readFileSync(cssPath, "utf-8");
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerOutput, {
      customCss: css,
    })
  );
}
