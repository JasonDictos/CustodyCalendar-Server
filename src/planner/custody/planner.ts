import { Plan, Exchange, Occurrance } from "./types"
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

	// In alternating cases this is our saved cursor for the last entity position
	// this allows for an infinite number of repetitions (mom,mom,mom,dad,dad,dad
	// would equate to 3 repetitions with mom, then 3 with dad)
	lastEntityIndex: number
	entities: string[]		// Split array of all instances for entitys (comma delimited)

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
	protected mLastEntity = ""
	protected mCount = 0

	constructor(plans: Plan[], start: DateTime, stop: Duration | DateTime) {
		this.mPlans = Planner.explodePlans(plans)
		this.mStart = start
		if (stop instanceof Duration)
			this.mStop = start.plus(stop)
		else
			this.mStop = stop
	}

	static explodeRange(key: string, bucket: string[]) {
		const [start, stop] = key.split("-")
		const startIndex = bucket.indexOf(start)
		const stopIndex = bucket.indexOf(stop)
		if (startIndex == -1 || startIndex == 0)
			throw new Error(`Invalid start ${start}`)

		// Allow no - just one month/day
		if (start && !stop)
			return [startIndex]
		if (stopIndex == -1 || stopIndex == 0)
			throw new Error(`Invalid stop ${stop}`)

		const result: number[] = []

		for (let index = startIndex; index < bucket.length; index++) {
			result.push(index)
			if (index == stopIndex) {
				return result
			}
		}

		for (let index = 1; index <= stopIndex; index++)
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
		const entities = plan.entity.split(",")
		return {
			weekdays,
			months,
			lastEntityIndex: 0,
			entities,
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

	static selectNextEntity(plan: ExplodedPlan): string {
		if (plan.lastEntityIndex < plan.entities.length)
			return plan.entities[plan.lastEntityIndex++]
		plan.lastEntityIndex = 0
		return plan.entities[0]
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
				if (plan.weekdays[0] != cWeekday)
					continue

				matchingPlan = plan
				break
			}

			// Now if we found an occurrance, advanece by 1 minute until we breach
			// the end (this allows the calendar to handle leap seconds etc.)
			if (matchingPlan) {
				// We can advance our start to the start of the plan
				let stopTime = this.mStart = this.mStart.set({ hour: matchingPlan.start.hour, minute: matchingPlan.start.minute })

				// Now if the plan has more then 1 day in it add those full days
				stopTime = stopTime.plus({ days: matchingPlan.weekdays.length - 1})

				// Now advance to the stop time in the plan this will represent the absolute stop time of the event
				stopTime = stopTime.set({ hour: matchingPlan.stop.hour, minute: matchingPlan.stop.minute })

				// Now we can set the hour/minute of the start time as its on the right day
				// for alternating we allow %entity% macro to get substituted for a generic description
				const entity = Planner.selectNextEntity(matchingPlan)
				let exchange = matchingPlan.plan.start.exchange

				// If this is a continuation (from whatever algorithm) the exchange is None to indicate no
				// transition is in order
				if (entity == this.mLastEntity)
					exchange = Exchange.None

				const description = matchingPlan.plan.description.replace(/%entity%/g, entity)
				const occurrance: Occurrance = {
					start: this.mStart,
					stop: stopTime,
					description,
					info: {
						entity,
						exchange
					}
				}
				this.mLastEntity = occurrance.info.entity

				// And now we can advance our start time to be at the stop time of the event
				this.mStart = stopTime
				this.mCount++
				return { done: this.mStart >= this.mStop, value: occurrance }
			}

			// Hmm no match... advance by 1 minute (@@TODO may be too small)
			if (this.mCount == 0) {
				this.mStart = this.mStart.plus({ minute: 1 })
				continue
			}
			console.log("HOLE DETECTED")
		}

		// No more
		return { done: true, value: null }
	}

	[Symbol.iterator](): IterableIterator<Occurrance> {
		return this
	}
}