import { Connection } from './Connection';

export class SQLite extends Connection {
    constructor(config: any) {
        super("sqlite", config);
    }
}