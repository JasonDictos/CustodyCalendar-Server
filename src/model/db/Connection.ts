import knex from 'knex';

export class Connection {
    constructor(
        private mClient: string,
        private mConfig: any,
        private mConn: any = null) { 
        
    }

    async connect() {
        if (!this.mConn) {
            this.mConn = await knex({ client: this.mClient, connection: this.mConfig });
            await this.mConn.initialize();
        }
    }

    get schema() {
        return this.mConn.schema;
    }
}