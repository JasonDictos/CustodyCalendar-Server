import * as table from "../model"
import { Knex } from "knex"
import { DateTime } from "luxon"

export enum SeriesType {
	// Handled by the event.generator.Custody generator
	Custody = "custody",

	// Handled by the event.generator.Series generator
	Series = "series"
}

// Common fields in the jsonb column
export interface Fields {
	// When this series started
	start: DateTime

	// Which guardians are part of the series
	guardianIds: table.RowId[]

	// Which dependents are being watched by said guardians above
	dependentIds: table.RowId[]
}

// The top level columns for this model
export interface Row extends table.Row<SeriesType, Fields> {
	// A logical group defined by the user to sub associate
	// definitions across series
	group?: string;
}

export class Model extends table.Model<SeriesType, Fields, Row> {
	constructor(conn: Knex) {
		super(conn, "event")
	}
}