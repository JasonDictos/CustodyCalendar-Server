import * as db from '../db';
import * as user from './user';

export async function provision(conn: db.Connection): Promise<db.Connection> {
	await conn.connect();
    conn.schema.hasTable('event').then(async function(exists) {
		if (!exists) {
			await conn.schema.createTable("users", function(col) {
				col.increments("id");
				col.string("type");
				col.json("body");
			})
		}
	});
	return conn;
}
