import * as table from "../model"
import { Knex } from "knex"

export enum Type {
	// planner.custody
	Custody = "custody",

	// planner.calendar
	Series = "calendar",

	// planner.holiday.us
	Holidays_US = "holidays.us"
}

// Common fields in the jsonb column
export interface Fields {
	// Which guardians are part of the series
	guardianIds: table.RowId[]

	// Which dependents are being watched by said guardians above
	dependentIds: table.RowId[]
}

export interface Custody extends Fields {
	guardian: string
	months: string
	days: string
	pickup: string
	start: string
	stop: string
}

// The top level columns for this model
export interface Row extends table.Row<Type, Fields> {
	// A logical group defined by the user to sub associate
	// definitions across series
	group?: string;
}

export class Model extends table.Model<Type, Fields, Row> {
	constructor(conn: Knex) {
		super(conn, "plan")
	}
}