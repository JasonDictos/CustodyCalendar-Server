import knex from 'knex';

export class Connection {
    constructor(
        private mClient: string,
        private mConfig: any,
        private mConn: any = null) { 
        
    }

    async connect() {
        if (!this.mConn)
            this.mConn = await knex({ client: this.mClient, connection: this.mConfig, useNullAsDefault: true });
    }

    get schema() { return this.mConn.schema; }
    get tables() { return this.mConn.tables; }

    table(name: string) { return this.mConn.table(name); }
}