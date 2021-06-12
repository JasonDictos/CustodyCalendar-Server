import { Occurrance } from "../types"
import { Plan } from "./types"
import { Info } from "./types"
import { DateTime } from "luxon"

export class Scheduler implements IterableIterator<Occurrance<Info>> {
	constructor(
		protected mStart: DateTime,
		protected mTimeZone: string,
		protected mGuardians: string[],
		protected mPlans: Plan[]) {

		const m = this.mStart.month
		const d = this.mStart.day
		const y = this.mStart.year
		const wd = this.mStart.weekday
		console.log(m, d, y, wd)
	}

	public next(): IteratorResult<Occurrance<Info>> {
		// @@ TODO
		return {
			done: false,
			value: {
				start: DateTime.fromISO("2020-08-21T18:00:00"),
				stop: DateTime.fromISO("2020-08-21T18:00:00"),
				name: "Time with Mom",
				fields: {
					guardian: this.mGuardians[0]
				}
			}
		}
	}

	[Symbol.iterator](): IterableIterator<Occurrance<Info>> {
		return this
	}
}