"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConnection = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs_1 = require("fs");
const path_1 = require("path");
const config_1 = require("../config");
let databaseInstance = null;
const getDatabaseConnection = () => {
    if (databaseInstance) {
        return databaseInstance;
    }
    const dbPath = config_1.appConfig.sqlitePath;
    const directoryPath = (0, path_1.dirname)(dbPath);
    if (!(0, fs_1.existsSync)(directoryPath)) {
        (0, fs_1.mkdirSync)(directoryPath, { recursive: true });
    }
    databaseInstance = new better_sqlite3_1.default(dbPath);
    databaseInstance.pragma("journal_mode = WAL");
    databaseInstance.pragma("foreign_keys = ON");
    return databaseInstance;
};
exports.getDatabaseConnection = getDatabaseConnection;
