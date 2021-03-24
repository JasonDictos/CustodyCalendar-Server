import { Knex } from "knex"
import * as util from "../util"

export async function up(conn: Knex, schemaName: string, tableName: string) {
	const schema = util.schema(conn)
	const hasTable = await conn.schema.withSchema(schemaName).hasTable(tableName)

	await conn.raw("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")

	if (!hasTable) {
		await conn.schema.withSchema(schemaName).createTable(tableName, table => {
			const columns = schema(table)
			columns.primaryUuid("id")

			table.timestamps(true, true)

			// Fields
			table.string("type")
				.notNullable()
			table.jsonb("fields")
				.notNullable()
		})
	}
}

export async function down(conn: Knex, schemaName: string, tableName: string) {
	return await conn.schema.withSchema(schemaName).dropTableIfExists(tableName)
}
