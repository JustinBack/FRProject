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
const Cassandra = require("cassandra-driver");
const FRProject = require("./index");
FRProject.EnvironmentManager.init();
const cassandraClient = new Cassandra.Client({
    contactPoints: ["127.0.0.1"],
    localDataCenter: 'datacenter1',
    keyspace: 'frproject'
});
const cassandraHelper = new FRProject.CassandraManager(cassandraClient);
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield cassandraHelper.initializeDatabase();
        yield cassandraHelper.exit();
    });
}
init();
