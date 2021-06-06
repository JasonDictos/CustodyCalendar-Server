import { Knex } from "knex"

import * as standard from "../../migrations/1_standard"
import { Database } from "../config"

export async function up(conn: Knex) {
	await standard.up(conn, Database.schema, "user")
}

export async function down(conn: Knex) {
	await standard.down(conn, Database.schema, "user")
}
