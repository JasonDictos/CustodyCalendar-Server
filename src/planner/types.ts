import { DateTime } from "luxon"

export interface Occurrance<T> {
	start: DateTime
	stop: DateTime
	description: string
	info: T
}