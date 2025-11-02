import Database from "better-sqlite3";
import { mkdirSync, existsSync } from "fs";
import { dirname } from "path";
import { appConfig } from "../config";

let databaseInstance: Database.Database | null = null;

export const getDatabaseConnection = (): Database.Database => {
  if (databaseInstance) {
    return databaseInstance;
  }

  const dbPath = appConfig.sqlitePath;
  const directoryPath = dirname(dbPath);

  if (!existsSync(directoryPath)) {
    mkdirSync(directoryPath, { recursive: true });
  }

  databaseInstance = new Database(dbPath);
  databaseInstance.pragma("journal_mode = WAL");
  databaseInstance.pragma("foreign_keys = ON");

  return databaseInstance;
};
