import Knex from "knex"
import * as config from "./config"
import * as user from "./user"

export interface Schema {
	name: string
	user: user.Model
}

export async function create(conn = Knex(config.Provider)) {
	return {
		name: conn.client.config.connection.schema,
		user: new user.Model(conn)
	}
}