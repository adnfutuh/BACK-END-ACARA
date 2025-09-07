import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes/api";
import db from "./utils/database";
import docs from "./docs/route";

async function init() {
  try {
    const result = await db();
    console.log("Database Status: ", result);
    const app = express();

    app.use(cors());

    app.use(bodyParser.json());

    const PORT = 3000;

    app.use("/api", router);

    docs(app);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    const err = error as unknown as Error;
    console.log(err.message);
  }
}
init();
