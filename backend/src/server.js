import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { bootstrapContent } from "./utils/bootstrap.js";

let server;

const shutdown = (signal) => {
  if (!server) {
    process.exit(0);
    return;
  }

  console.log(`Received ${signal}. Closing HTTP server...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

const startServer = async () => {
  try {
    await connectDb();
    await bootstrapContent();
    server = app.listen(env.port, () => {
      console.log(`Backend listening on http://localhost:${env.port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${env.port} is already in use. Stop the existing process or change PORT in backend/.env.`);
        process.exit(1);
      }
      throw error;
    });
  } catch (err) {
    console.error("Failed to start backend.", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
