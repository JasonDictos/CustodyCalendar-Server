import Knex from "knex"
import * as config from "./config"
import * as event from "./event"
import * as entity from "./entity"

export interface Schema {
	name: string
	event: event.Model
	entity: entity.Model
}

export async function create(conn = Knex(config.Provider), schema = config.Database.schema) {
	return {
		name: schema,
		events: new event.Model(conn),
		entities: new entity.Model(conn)
	}
}