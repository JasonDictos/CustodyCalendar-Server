import { Knex } from "knex"
import { Row } from "./user"
import * as model from "../../model"

export class Table extends model.Table<Row> {
	async create() {
		if (!(await this.exists())) {
			await this.schema.createTable(this.name, table => {
				table.increments("id")
				table.string("type").notNullable()
				table.string("name").notNullable()
				table.json("body")
			})
		}
		return this
	}
}


export async function table(schema: string, knex: Knex): Promise<Table> {
	await knex.schema.createSchemaIfNotExists(schema)
	return await (new Table("user", schema, knex)).create()
}