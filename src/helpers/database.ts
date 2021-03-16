import { Pool } from 'pg';
import * as Color from 'chalk';
import { LoggingManager } from '../index';

export class DatabaseManager {

    private DatabaseClient: Pool;

    public constructor(Client: Pool) {
        this.DatabaseClient = Client;
    }


    public async initializeDatabase() {
        try {
            await this.DatabaseClient.query("CREATE TABLE IF NOT EXISTS personas (persona_id bigint PRIMARY KEY, persona_data text);");
            LoggingManager.info(`Table "${Color.magenta("personas")}" has been created!`);
        } catch (ex: any) {
            return LoggingManager.error(`Failed to create table "${Color.magenta("personas")}"`, ex);
        }

    }


    public async exit() {

        await this.DatabaseClient.end();
    }


}