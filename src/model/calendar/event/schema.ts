import * as db from '../../db';
import * as event from './event';

export async function provision(conn: db.Connection): Promise<db.Connection> {
	await conn.connect();

    conn.schema.hasTable('event').then(async function(exists) {
		if (!exists) {
			await conn.schema.createTable("event", function(col) {
				col.increments("id");
				col.string("type");
				col.datetime("start");
				col.datetime("stop");
				col.json("body");
			});
		}
	});

	return conn;
}
