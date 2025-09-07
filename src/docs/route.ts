import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";

export default function docs(app: Express) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerOutput, {
      customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.6.2/swagger-ui.css",
    })
  );
}
