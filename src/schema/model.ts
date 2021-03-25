import { Knex } from "knex"

// We use postgresql's built in uuid_v4 plugin for ids to allow for cross
// referencing globally across databases
export type RowId = string;

// The row of the table, fully formed when type/subtype/fields get defined
export interface Row<Type, Fields> {	
	id: RowId;
	type: Type;
	fields: Fields;
}

// A basic table class provides a few obvious methods all row based
// objects in our app provide
export abstract class Model<Type, Fields, RowType extends Row<Type, Fields>> {
	constructor(
		protected mConn: Knex,
		protected mTable: string) {
	}

	get tableName(): string { return this.mTable }
	get schemaName(): string { return this.mConn.client.config.connection.schema }

	async exists() { return this.schema.hasTable(this.tableName) }

	async get(id: RowId, type?: Type): Promise<RowType> {
		const res = await this.table.select().where(type ? { id, type } : { id })
		if (res.length)
			return res[0]
		throw new Error(`Not found ${id}`)
	}

	async delete(id?: RowId) {
		if (id)
			await this.table.delete().where({ id })
		else
			await this.table.delete()
	}

	async count(): Promise<number> {
		const query = this.table.count()
		const res = await query
		return Number(res[0].count)
	}

	async insert(input: Omit<RowType, "id">): Promise<RowId> {
		return (await this.table.insert(input).returning<number>("id"))[0]
	}

	async select(input?: Partial<RowType>): Promise<RowType[]> {
		const query = this.table.select()
		if (input)
			query.where(input)

		return await query
	}

	protected get table() {
		if (this.schemaName)
			return this.mConn.withSchema(this.schemaName).table(this.tableName)
		return this.mConn.table(this.tableName) 
	}
	protected get conn() { return this.mConn }
	protected get schema() { return this.mConn.schema }
}