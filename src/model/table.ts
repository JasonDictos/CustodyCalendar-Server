import { Knex } from 'knex';

// A basic table class provides a few obvious methods all row based
// objects in our app provide
export abstract class Table<Row> {
	constructor(
		protected mTable: string,
		protected mSchema: string,
		protected mKnex: Knex) {
	}

	get name() { return this.mTable; }

	async get(id: number) {
		return (await this.query.select().where({ id }) as Row[])[0]
	}

	async count() {
		const query = this.query.count<Record<string, number>>();
		const res = (await query)[0] as any;
		return Number(res.count);
	}

	async add(input: Omit<Row, 'id'>) {
		return await this.query.insert(input);
	}

	async list(input?: Partial<Row>) {
		const query = this.query.select();
		if (input) 
			query.where(input)

		return (await query as Row[])
	}

	async exists() {
		return this.schema.hasTable(this.mTable);
	}

	abstract create(): Promise<Table<Row>>;

	// Internal hooks to rather confusing things in knex
	protected get query() { return this.mKnex.withSchema(this.mSchema).table(this.mTable); }
	protected get schema() { return this.mKnex.schema.withSchema(this.mSchema); }
}
