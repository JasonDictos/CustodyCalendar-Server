import { DateTime } from "luxon"
import * as table from "../model"
import { Knex } from "knex"

export enum Type {
	Visitation = "visitiation", // A custodioal is enjoying some time with one or more dependents,
								// another is picking them up
	Appointment = "appointment",// Some responsible party is taking a dependent to an appointment
								// presumably this is a one off with the same guardian taking them back
	Activity = "activity"       // Some responsible party is taking the dependent to an activity,
								// another is picking them up
}

// Common fields in the jsonb column
export interface Fields {
	// Which guardians are watching the dependents
	guardians: table.RowId[];

	// Which dependents are being watched by said guardians above
	dependentIds: table.RowId[];
}

// The top level columns for this model
export interface Row extends table.Row<Type, Fields> {
	// Name of event 
	name: string;

	// Start/stop times for event
	start: DateTime;
	stop: DateTime;

	// Where the event is taking place
	locationId: table.RowId;
}

export class Model extends table.Model<Type, Fields, Row> {
	constructor(conn: Knex) {
		super(conn, "event")
	}
}