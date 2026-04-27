import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";

const app = createApp();
const server = createServer(app);

async function start() {
  await connectDatabase();
  server.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Pokemon Battle server listening on ${env.PORT}`);
  });
}

async function shutdown(signal: string) {
  console.log(`Received ${signal}; shutting down`);
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

start().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
