export const appConfig = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  sqlitePath: process.env.SQLITE_PATH ?? "./data/enrollments.db"
};
