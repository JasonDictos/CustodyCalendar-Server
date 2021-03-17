import * as db from '../db';
import * as entity from './entity';
import * as event from './event';

export async function provision(conn: db.Connection): Promise<db.Connection> {
	await conn.connect();

	await conn.schema.createTableIfNotExists("events", function(col) {
		col.increments("id");
		col.string("type");
		col.datetime("start");
		col.datetime("stop");
		col.json("body");
	});

	await conn.schema.createTableIfNotExists("entities", function(col) {
		col.increments("id");
		col.string("type");
		col.string("subType");
		col.json("body");
	});

	return conn;
}
