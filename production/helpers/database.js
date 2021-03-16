"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
const Color = require("chalk");
const index_1 = require("../index");
class DatabaseManager {
    constructor(Client) {
        this.DatabaseClient = Client;
    }
    initializeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.DatabaseClient.query("CREATE TABLE IF NOT EXISTS personas (persona_id bigint PRIMARY KEY, persona_data text);");
                index_1.LoggingManager.info(`Table "${Color.magenta("personas")}" has been created!`);
            }
            catch (ex) {
                return index_1.LoggingManager.error(`Failed to create table "${Color.magenta("personas")}"`, ex);
            }
        });
    }
    exit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.DatabaseClient.end();
        });
    }
}
exports.DatabaseManager = DatabaseManager;
