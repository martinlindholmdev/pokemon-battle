import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  mongoose.set("bufferCommands", false);
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 8000
    });
    await verifyApplicationRead();
  } catch (error) {
    if (!env.fallbackMongoUri) {
      throw error;
    }
    await mongoose.disconnect();
    await mongoose.connect(env.fallbackMongoUri, {
      serverSelectionTimeoutMS: 8000
    });
    await verifyApplicationRead();
  }
}

async function verifyApplicationRead() {
  if (!mongoose.connection.db) {
    throw new Error("MongoDB connection did not expose a database");
  }
  await mongoose.connection.db.collection("users").findOne({});
}

export async function pingDatabase() {
  if (!mongoose.connection.db) {
    return false;
  }
  await mongoose.connection.db.admin().ping();
  return true;
}

export function scheduleDatabaseReconnect() {
  setInterval(() => {
    if (mongoose.connection.readyState !== 0) {
      return;
    }

    connectDatabase().catch((error) => {
      console.error(error instanceof Error ? error.message : "MongoDB reconnect failed");
    });
  }, 60_000).unref();
}

export function getMongoState() {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] ?? "unknown";
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
