import { DateTime } from "luxon"

export interface Occurrance<T> {
	start: DateTime
	stop: DateTime
	name: string
	fields: T
}