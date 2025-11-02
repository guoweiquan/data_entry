"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = void 0;
const connection_1 = require("./connection");
const runMigrations = () => {
    const database = (0, connection_1.getDatabaseConnection)();
    const createEnrollmentsTableSql = `
    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      gender TEXT NOT NULL CHECK (gender IN ('男', '女', '其他')),
      course TEXT NOT NULL,
      contact TEXT NOT NULL,
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
    const createNameIndexSql = `CREATE INDEX IF NOT EXISTS idx_enrollments_name ON enrollments (name);`;
    const createCourseIndexSql = `CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments (course);`;
    const createUpdateTriggerSql = `
    CREATE TRIGGER IF NOT EXISTS trg_enrollments_updated
    AFTER UPDATE ON enrollments
    BEGIN
      UPDATE enrollments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `;
    database.exec(createEnrollmentsTableSql);
    database.exec(createNameIndexSql);
    database.exec(createCourseIndexSql);
    database.exec(createUpdateTriggerSql);
};
exports.runMigrations = runMigrations;
