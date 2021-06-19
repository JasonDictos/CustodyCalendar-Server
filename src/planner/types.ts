import { DateTime } from "luxon"

export interface Occurrence<T> {
	start: DateTime
	stop: DateTime
	description: string
	info: T
}