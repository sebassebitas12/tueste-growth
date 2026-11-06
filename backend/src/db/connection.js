import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve, isAbsolute } from "node:path";
import process from "node:process";

const repoRoot = resolve(import.meta.dirname, "../../..");
try {
  process.loadEnvFile(resolve(repoRoot, ".env"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const configuredPath = process.env.DB_PATH || "backend/data/tueste.sqlite";
const filename = isAbsolute(configuredPath)
  ? configuredPath
  : resolve(repoRoot, configuredPath);
mkdirSync(dirname(filename), { recursive: true });
export const db = new DatabaseSync(filename);
db.exec(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));
db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");

export function transaction(fn) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const value = fn();
    db.exec("COMMIT");
    return value;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export const centsToDollars = (cents) => Number((cents / 100).toFixed(2));
