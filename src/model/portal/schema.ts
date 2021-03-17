import * as db from '../db';
import * as user from './user';

export async function provision(conn: db.Connection): Promise<db.Connection> {
	await conn.connect();
	await conn.schema.createTableIfNotExists("users", function(col) {
		col.increments("id");
		col.string("type");
		col.json("body");
	})
	return conn;
}
