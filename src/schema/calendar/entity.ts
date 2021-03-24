import { DateTime } from "luxon"
import * as table from "../model"
import { Knex } from "knex"

// Defines the body concretely for the entity row
export enum Type {
	Guardian = "guardian",
	Dependent = "dependent",
	Location = "location",
	PhoneNumber = "phonenumber",
}

// Entity wrapper to generalize how we encode entities in the eneity table
export interface Fields {
	name: string
}

export interface PhoneNumber extends Fields {
	number: string				// fully qualified phone number
}

export interface Location extends Fields {
	address: string						// fully qualified address (country etc. warranted)
	geo?: { lon: number, lat: number}	// geo position
}

export interface Guardian extends Fields {
	calendar?: string;        	// link back to front end portal record of payee or logged in customer info
	email: string;              // full name (may be skipped if defaults fetched from customerId)
	dependentIds: table.RowId[];		// row ids for dependents (want them separate to be able to store it once
								// and reference it as needed)
}

export interface Dependent extends Fields {
	birthday: DateTime;
	custodians: table.RowId[];
}

export type Row = table.Row<Type, Fields>;
export class Model extends table.Model<Type, Fields> {
	constructor(conn: Knex) {
		super(conn, "entity")
	}
}