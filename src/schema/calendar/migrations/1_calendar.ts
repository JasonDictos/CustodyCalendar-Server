import { Knex } from "knex"

import * as standard from "../../migrations/1_standard"
import { Database } from "../config"

export async function up(conn: Knex) {
	await standard.up(conn, Database.schema, "entity")
	await standard.up(conn, Database.schema, "plan")
	await conn.schema.withSchema(Database.schema).alterTable("plan", table => {
		table.string("group")
			.nullable()
			.comment("Group of events")
	})

	await conn.schema.withSchema(Database.schema).alterTable("entity", table => {
		table.string("name")
			.nullable()
			.comment("Name of the entity")
		table.uuid("portalUserId")
			.nullable()
			.comment("Id back to portal entry for user")
	})
}

export async function down(conn: Knex) {
	await standard.down(conn, Database.schema, "plan")
	await standard.down(conn, Database.schema, "entity")
}
