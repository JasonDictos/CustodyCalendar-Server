import { DateTime } from "luxon"
import * as table from "../model"
import { Knex } from "knex"
import { assert } from "node:console"

// Defines the body concretely for the entity row
export enum Type {
	Guardian = "guardian",		// A person, acting as a legal guardian for a dependent
	Dependent = "dependent",	// A child/cat/dog, requiring guarding
	Group = "group",			// A relative, baseball team, some place, or person with ephemeral guardianship
}

export interface Fields {
	email?: string
	numbers?: PhoneNumber[]		// some entities may have multiple numbers/emails
	birthday?: DateTime			// optionally (mostly for dependents)
	locations?: Location[]		// leave locations optional in the base
}

export interface PhoneNumber {
	type: string   // type of number (cell/house/beach house idk)	
	number: string // fully qualified phone number
}

export interface Location {
	name: string						// summer house/home etc.
	address: string						// fully qualified address (country etc. warranted)
	geo?: { lon: number, lat: number}	// geo position
}

export interface Guardian extends Fields {
	portalUserId?: string       // link back to front end portal record of payee or logged in customer info
	dependentIds: table.RowId[]	// row ids for dependents (want them separate to be able to store it once
								// and reference it as needed)
	locations: Location[]		// enforce locations for guardians
}

export interface Dependent extends Fields {
	portalUserId?: string       // link back to front end portal record of payee or logged in customer info
}

// Our entity row
export interface Row extends table.Row<Type, Fields> {
	portalUserId?: string       // if this entity is a user in the system
	name: string				// every place/person must be named
}

export class Model extends table.Model<Type, Fields, Row> {
	constructor(conn: Knex) {
		super(conn, "entity")
	}

	async selectDependents(guardianId: table.RowId, fields?: Dependent): Promise<Row[]> {
		const guardian = await this.get(guardianId, Type.Guardian)
		let query = this.table.select().whereIn("id", (guardian.fields as Guardian).dependentIds)
		if (fields)
			query = query.andWhere(fields)
		return await query
	}
}