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
exports.CassandraManager = void 0;
const Color = require("chalk");
const index_1 = require("../index");
class CassandraManager {
    constructor(Client) {
        this.CassandraClient = Client;
    }
    initializeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield (yield this.CassandraClient.execute("SELECT table_name FROM system_schema.tables WHERE keyspace_name='frproject' AND table_name = 'models'")).rowLength) === 0) {
                try {
                    yield this.CassandraClient.execute("CREATE TABLE Models (persona_id bigint PRIMARY KEY, model_data text)");
                }
                catch (ex) {
                    return index_1.LoggingManager.error(`Failed to create table "${Color.magenta("Models")}"`, ex);
                }
            }
            index_1.LoggingManager.info("Test");
        });
    }
    exit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.CassandraClient.shutdown();
        });
    }
}
exports.CassandraManager = CassandraManager;
