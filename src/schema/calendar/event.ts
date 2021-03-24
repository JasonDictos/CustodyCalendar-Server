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

export interface Fields {
	name: string;
	start: DateTime;
	stop: DateTime;
	entityId: number;
}

export interface Visitation extends Fields {
	pickupEntityId: number;
	dropoffEntityId: number;
	dependentIds: table.RowId[];
	locationId: table.RowId;
}

export interface Appointment extends Fields {
	guardianId: number;
}

export type Row = table.Row<Type, Fields>
export class Model extends table.Model<Type, Fields> {
	constructor(conn: Knex) {
		super(conn, "event")
	}
}