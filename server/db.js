import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable.");
}

export const pool = new Pool({
  connectionString,
});
