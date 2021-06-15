import { Plan, Info, Occurrance } from "./types"
import { DateTime, Duration } from "luxon"

const Months = [
	"",
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
]

const Weekdays = [
	"",
	"Mon",	// 1
	"Tue",	// 2
	"Wed",	// 3
	"Thu",	// 4
	"Fri",	// 5
	"Sat",	// 6
	"Sun",	// 7
]

// The exploded plan is in a form best suited for computation within
// the planner, it takes things like weekday or month ranges (mon-wed) and auto
// wraps so (fri-mon) works for example
export interface ExplodedPlan {
	weekdays: number[]		// All indexes for weekdays represented by range
	months: number[]		// All indexes for months represented by range

	// Start/stop
	// weekday - position in weekday marker applies to (0-6)
	// hour - 24 hour hour portion of time (00-23)
	// minute - 0-59
	start: {
		weekday: number
		hour: number
		minute: number
	}
	stop: {
		weekday: number
		hour: number
		minute: number
	}

	// Original plan this was exploded from
	plan: Plan
}

export class Planner implements IterableIterator<Occurrance> {
	protected mPlans: ExplodedPlan[]
	protected mStart: DateTime
	protected mStop: DateTime

	constructor(plans: Plan[], start: DateTime, duration = Duration.fromObject({ years: 1 })) {
		this.mPlans = Planner.explodePlans(plans)
		this.mStart = start
		this.mStop = start.plus(duration)
	}

	static explodeRange(key: string, bucket: string[]) {
		const [start, stop] = key.split("-")
		const startIndex = bucket.indexOf(start)
		const stopIndex = bucket.indexOf(stop)
		if (startIndex == -1 || startIndex == 0)
			throw new Error(`Invalid start ${start}`)
		if (stopIndex == -1 || stopIndex == 0)
			throw new Error(`Invalid stop ${stop}`)

		const result: number[] = []
		for (let index = startIndex; index < bucket.length && index != stopIndex; index++)
			result.push(index)
		for (let index = stopIndex; index <= stopIndex; index++)
			result.push(index)
		return result
	}

	static explodeTimeOfDay(timeOfDay: string) {
		const [hour, minute] = timeOfDay.split(":").map(f => parseInt(f, 10))
		if (hour > 23 || hour < 0)
			throw new Error(`Invalid hour ${hour}`)
		if (minute > 59 || minute < 0)
			throw new Error(`Invalid minute ${minute}`)
		return [hour, minute]
	}

	static explodePlan(plan: Plan): ExplodedPlan {
		const [startHour, startMinute] = Planner.explodeTimeOfDay(plan.start.timeOfDay)
		const [stopHour, stopMinute] = Planner.explodeTimeOfDay(plan.stop.timeOfDay)
		const weekdays = Planner.explodeRange(plan.weekdays, Weekdays)
		const months = Planner.explodeRange(plan.months, Months)
		return {
			weekdays,
			months,
			start: {
				weekday: weekdays[0],
				hour: startHour,
				minute: startMinute
			},
			stop: {
				weekday: weekdays[weekdays.length - 1],
				hour: stopHour,
				minute: stopMinute
			},
			plan
		}
	}

	static explodePlans(plans: Plan[]): ExplodedPlan[] {
		const explodedPlans: ExplodedPlan[] = []
		for (const plan of plans)
			explodedPlans.push(Planner.explodePlan(plan))
		return explodedPlans
	}

	public next(): IteratorResult<Occurrance> {
		// Loop until our cursor breaches the end stop
		while (this.mStart < this.mStop) {
			// Grab the current month and weekday
			const cMonth = this.mStart.month
			const cWeekday = this.mStart.weekday

			// Loop and continue matching occurrances until we run out
			// we keep looping even if we found a match this allows 'layered' to
			// override earlier definitions
			let matchingPlan
			for (const plan of this.mPlans) {
				if (plan.months.indexOf(cMonth) == -1)
					continue
				if (plan.weekdays.indexOf(cWeekday) != 0)
					continue

				matchingPlan = plan
			}

			// Now if we found an occurrance, advanece by 1 minute until we breach
			// the end (this allows the calendar to handle leap seconds etc.)
			if (matchingPlan) {
				this.mStart = this.mStart.set({ hour: matchingPlan.start.hour, minute: matchingPlan.start.minute })
				let stopTime = this.mStart

				// Position (in 1 day intervals) until we reach the final day in the plan
				while (matchingPlan.weekdays.indexOf(stopTime.weekday) != matchingPlan.weekdays.length - 1) {
					stopTime = stopTime.plus({ day: 1})
				}

				// Now we can set the hour/minute of the start time as its on the right day
				const occurrance: Occurrance = {
					start: this.mStart,
					stop: this.mStart = stopTime.set({ hour: matchingPlan.stop.hour, minute: matchingPlan.stop.minute}),
					description: matchingPlan.plan.description,
					info: {
						entity: matchingPlan.plan.entity,
						exchange: matchingPlan.plan.start.exchange
					}
				}
				return { done: this.mStart >= this.mStop, value: occurrance }
			}

			// Hmm no match... advance by 1 minute (@@TODO may be too small)
			this.mStart = this.mStart.plus({ minute: 1 })
		}

		// No more
		return { done: true, value: null }
	}

	[Symbol.iterator](): IterableIterator<Occurrance> {
		return this
	}
}