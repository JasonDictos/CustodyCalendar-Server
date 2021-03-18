import * as db from '../../db';
import * as entity from './entity';

export async function provision(conn: db.Connection) {
	await conn.connect();

    conn.schema.hasTable('entity').then(async function(exists) {
        if (!exists) {
			await conn.schema.createTable("entity", function(col) {
				col.increments("id");
				col.string("type");
				col.string("subType");
				col.json("body");
			});
        }
    });

	return conn;
}
