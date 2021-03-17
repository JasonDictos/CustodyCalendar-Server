import { Tables } from 'knex/types/tables';
import { Connection } from './Connection';

export class PostgreSQL extends Connection {
    constructor(config: any) {
        super("pg", config);
    }
}