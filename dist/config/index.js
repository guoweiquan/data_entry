"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
exports.appConfig = {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    sqlitePath: process.env.SQLITE_PATH ?? "D:/SQLiteStudio/db/code_buddy"
};
