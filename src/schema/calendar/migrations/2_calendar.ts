import { Knex } from "knex"
import * as util from "../../util"
import { Database } from "../config"
import * as standard from "../../migrations/1_standard"

async function makeEventTable(conn: Knex) {
	const schema = util.schema(conn)
	await standard.up(conn, Database.schema, "event")
	await conn.schema.withSchema(Database.schema).alterTable("event", table => {
		table.dateTime("start")
			.nullable()
			.comment("Start of the event")
		table.dateTime("stop")
			.nullable()
			.comment("End of the event")

		// Relationships
		const columns = schema(table)
		columns.foreignUuid("entityId", {column: "id", table: `${Database.schema}.entity`}, true)
	})
}

export async function up(conn: Knex) {
	await standard.up(conn, Database.schema, "entity")
	await makeEventTable(conn)
}

export async function down(conn: Knex) {
	await standard.down(conn, Database.schema, "event")
	await standard.down(conn, Database.schema, "entity")
}
