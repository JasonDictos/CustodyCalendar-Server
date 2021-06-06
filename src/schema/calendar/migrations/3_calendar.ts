import { Knex } from "knex"
import { Database } from "../config"
import * as standard from "../../migrations/1_standard"

async function makeEntityTable(conn: Knex) {
	await standard.up(conn, Database.schema, "entity")
	await conn.schema.withSchema(Database.schema).alterTable("entity", table => {
		table.string("name")
			.nullable()
			.comment("Name of the entity")
		table.uuid("portalUserId")
			.nullable()
			.comment("Id back to portal entry for user")
	})
}

export async function up(conn: Knex) {
	await makeEntityTable(conn)
}

export async function down(conn: Knex) {
	await standard.down(conn, Database.schema, "event")
	await standard.down(conn, Database.schema, "entity")
}
