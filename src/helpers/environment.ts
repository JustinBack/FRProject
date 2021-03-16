import { LoggingManager } from '../index';
import * as dotenv from 'dotenv';
export class EnvironmentManager {

    public static init() {
        LoggingManager.debug(`Initializing .env file`);
        LoggingManager.debug("Found .env Environment:", dotenv.config());
        LoggingManager.debug(`Initialized .env file`);


        process.env.FR_ENV = process.env.FR_ENV || "development";
    }
}