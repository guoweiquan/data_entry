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

CREATE INDEX IF NOT EXISTS idx_enrollments_name ON enrollments (name);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments (course);

CREATE TRIGGER IF NOT EXISTS trg_enrollments_updated
AFTER UPDATE ON enrollments
FOR EACH ROW
BEGIN
    UPDATE enrollments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
