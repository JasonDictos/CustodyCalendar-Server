import knex from 'knex';

export class SQLite {
    public constructor(
        private mPath: string = ":memory:",
        private mConn: any = null) {
    }

    public async connect() {
        if (!this.mConn) {
            this.mConn = await knex({
                client: 'sqlite',
                connection: {
                    filename: this.mPath
                },
                useNullAsDefault: true
            });
        }
    }
}