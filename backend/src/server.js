import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { bootstrapContent } from "./utils/bootstrap.js";

const startServer = async () => {
  try {
    await connectDb();
    await bootstrapContent();
    app.listen(env.port, () => {
      console.log(`Backend listening on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error("Failed to start backend.", err);
    process.exit(1);
  }
};

startServer();
