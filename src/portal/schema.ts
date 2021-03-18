import { Knex } from 'knex';
import { Database } from './config';
import * as user from './user';

export interface Schema {
	name: string;
	user: user.Table;
}

export async function connect(knex: Knex): Promise<Schema> {
	return {
		name: Database.schema,
		user: (await user.table(Database.schema, knex))
	}
}