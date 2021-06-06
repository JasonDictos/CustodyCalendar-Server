import Knex from "knex"
import * as config from "./config"
import * as event from "./event"
import * as entity from "./entity"

export interface Schema {
	name: string
	event: event.Model
	entity: entity.Model
}

export function create(conn = Knex(config.Provider)) {
	return {
		name: conn.client.config.connection.schema,
		event: new event.Model(conn),
		entity: new entity.Model(conn)
	}
}