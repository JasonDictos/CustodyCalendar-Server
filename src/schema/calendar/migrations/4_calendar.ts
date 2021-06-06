import { Knex } from "knex"
import { Database } from "../config"
import * as standard from "../../migrations/1_standard"
import * as util from "../../util"

async function makeEventTable(conn: Knex) {
	await standard.up(conn, Database.schema, "event")
	await conn.schema.withSchema(Database.schema).alterTable("event", table => {
		table.string("name")
			.nullable()
			.comment("Name of the event")
		table.renameColumn("entityId", "guardianId")
			.comment("Primary guardian during the event")
		util.schema(conn)(table).foreignUuid("groupId", {column: "id", table: `${Database.schema}.entity`}, true)
			.nullable()
			.comment("Group entity")
	})
}

export async function up(conn: Knex) {
	await makeEventTable(conn)
}

export async function down(conn: Knex) {
	await standard.down(conn, Database.schema, "event")
	await standard.down(conn, Database.schema, "entity")
}
