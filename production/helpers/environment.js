"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentManager = void 0;
const index_1 = require("../index");
const dotenv = require("dotenv");
class EnvironmentManager {
    static init() {
        index_1.LoggingManager.debug(`Initializing .env file`);
        index_1.LoggingManager.debug("Found .env Environment:", dotenv.config());
        index_1.LoggingManager.debug(`Initialized .env file`);
        process.env.FR_ENV = process.env.FR_ENV || "development";
    }
}
exports.EnvironmentManager = EnvironmentManager;
