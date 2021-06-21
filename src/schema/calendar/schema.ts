import Knex from "knex"
import * as config from "./config"
import * as plan from "./plan"
import * as entity from "./entity"

export interface Schema {
	name: string
	plan: plan.Model
	entity: entity.Model
}

export function create(conn = Knex(config.Provider)) {
	return {
		name: conn.client.config.connection.schema,
		plan: new plan.Model(conn),
		entity: new entity.Model(conn)
	}
}