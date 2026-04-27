import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().optional(),
  MONGODB_ATLAS_URI: z.string().optional(),
  JWT_SECRET: z.string().min(24),
  WBS_LLM_URL: z.string().url().optional().or(z.literal("")),
  WBS_LLM_MODEL: z.string().optional(),
  WBS_LLM_API_KEY: z.string().optional()
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const fields = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
  throw new Error(`Invalid environment configuration: ${fields}`);
}

const values = parsed.data;
const mongoUri =
  values.NODE_ENV === "production"
    ? values.MONGODB_ATLAS_URI || values.MONGODB_URI
    : values.MONGODB_URI || values.MONGODB_ATLAS_URI;
const fallbackMongoUri =
  values.NODE_ENV === "production"
    ? values.MONGODB_URI
    : values.MONGODB_ATLAS_URI;

if (!mongoUri) {
  throw new Error("Missing MongoDB connection string");
}

export const env = {
  ...values,
  mongoUri,
  fallbackMongoUri: fallbackMongoUri && fallbackMongoUri !== mongoUri ? fallbackMongoUri : undefined,
  isProduction: values.NODE_ENV === "production"
};
