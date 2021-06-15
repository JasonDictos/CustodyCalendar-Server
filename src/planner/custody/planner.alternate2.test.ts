import * as custody from "."
import { Duration, DateTime } from "luxon"

describe("planner.custody.Planner", function()  {
	test("Alternate2", async function() {
		// January 2021
		// SU MO TU WE TH FR SA
		//                01 02
		// 03 04 05 06 07 08 09
		// 10 11 12 13 14 15 16
		// 17 18 19 20 21 22 23
		// 24 25 26 27 28 29 30
		// 31

		// Alternating weekends
		const plan: custody.Plan[] = [
			{
				// Dad always has kids wed-fri
				entity: "dad",
				months: "Jan-Dec",
				weekdays: "Wed-Fri",
				start: {
					timeOfDay: "07:45",
					// Kids are dropped off (To dads, by mom)
					exchange: custody.Exchange.Dropoff
				},
				stop: {
					timeOfDay: "17:00",
					// Kids are picked up (From dads, by mom)
					exchange: custody.Exchange.Pickup
				},
				description: "Time with %entity%",
			},
			{
				// Mom always has the kids mon-wed
				entity: "mom",
				months: "Jan-Dec",
				weekdays: "Mon-Wed",
				start: {
					timeOfDay: "07:45",
					// Kids are dropped off (by dad, to mom)
					exchange: custody.Exchange.Dropoff
				},
				stop: {
					timeOfDay: "07:45",
					// Kids are dropped off (to dads, by mom)
					exchange: custody.Exchange.Dropoff
				},
				description: "Time with %entity%",
			},
			{
				// Dad/mom alternate on Fri-Mon schedules (Starting with mom)
				// in 1 interval (e.g. every other weekend)
				entity: "mom,dad",
				months: "Jan-Dec",
				weekdays: "Fri-Mon",
				start: {
					timeOfDay: "17:00",
					// Kids are picked up (from whoever, to whoever)
					exchange: custody.Exchange.Pickup
				},
				stop: {
					timeOfDay: "07:45",
					// Kids are dropped off (to whoever, by whoever)
					exchange: custody.Exchange.Dropoff
				},
				description: "Weekend with %entity%",
			}]

		// Expected occurrances
		const expected: custody.Occurrance[] = [
			{
				start: DateTime.fromISO("2021-01-01T17:00:00"),
				stop: DateTime.fromISO("2021-01-04T07:45:00"),
				description: "Weekend with mom",
				info: {
					entity: "mom",
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-04T07:45:00"),
				stop: DateTime.fromISO("2021-01-06T07:45:00"),
				description: "Time with mom",
				info: {
					entity: "mom",
					// Continuation from previous, no exchange required
					exchange: custody.Exchange.None
				}
			},
			{
				start: DateTime.fromISO("2021-01-06T07:45:00"),
				stop: DateTime.fromISO("2021-01-08T17:00:00"),
				description: "Time with dad",
				info: {
					entity: "dad",
					// Transition from mom to dad (mom drops them off)
					exchange: custody.Exchange.Dropoff
				}
			},
			{
				start: DateTime.fromISO("2021-01-08T17:00:00"),
				stop: DateTime.fromISO("2021-01-11T07:45:00"),
				description: "Weekend with dad",
				info: {
					entity: "dad",
					// Continuation from dad, no exchange required
					exchange: custody.Exchange.None
				}
			},
			{
				start: DateTime.fromISO("2021-01-11T07:45:00"),
				stop: DateTime.fromISO("2021-01-13T07:45:00"),
				description: "Time with mom",
				info: {
					entity: "mom",
					// Dad drops them off
					exchange: custody.Exchange.Dropoff
				}
			},
			{
				start: DateTime.fromISO("2021-01-13T07:45:00"),
				stop: DateTime.fromISO("2021-01-15T17:00:00"),
				description: "Time with dad",
				info: {
					entity: "dad",
					// Mom drops them off
					exchange: custody.Exchange.Dropoff
				}
			},
			{
				start: DateTime.fromISO("2021-01-15T17:00:00"),
				stop: DateTime.fromISO("2021-01-18T07:45:00"),
				description: "Weekend with mom",
				info: {
					entity: "mom",
					// Mom picks them off
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-18T07:45:00"),
				stop: DateTime.fromISO("2021-01-20T07:45:00"),
				description: "Time with mom",
				info: {
					entity: "mom",
					// Continuation
					exchange: custody.Exchange.None
				}
			},
			{
				start: DateTime.fromISO("2021-01-20T07:45:00"),
				stop: DateTime.fromISO("2021-01-22T17:00:00"),
				description: "Time with dad",
				info: {
					entity: "dad",
					// Mom drops them off to dads
					exchange: custody.Exchange.Dropoff
				}
			},
			{
				start: DateTime.fromISO("2021-01-22T17:00:00"),
				stop: DateTime.fromISO("2021-01-25T07:45:00"),
				description: "Weekend with mom",
				info: {
					entity: "mom",
					// Mom picks them up from dads
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-25T07:45:00"),
				stop: DateTime.fromISO("2021-01-27T07:45:00"),
				description: "Time with mom",
				info: {
					entity: "mom",
					// Continuation
					exchange: custody.Exchange.None
				}
			},
			{
				start: DateTime.fromISO("2021-01-27T07:45:00"),
				stop: DateTime.fromISO("2021-01-29T17:00:00"),
				description: "Time with dad",
				info: {
					entity: "dad",
					// Mom drops them off to dads
					exchange: custody.Exchange.Dropoff
				}
			},
			{
				start: DateTime.fromISO("2021-01-29T17:00:00"),
				stop: DateTime.fromISO("2021-02-01T07:45:00"),
				description: "Weekend with dad",
				info: {
					entity: "dad",
					// Continuation
					exchange: custody.Exchange.None
				}
			}
		]

		const planner = new custody.Planner(
			plan,
			DateTime.fromISO("2021-01-01"),
			Duration.fromObject({ month: 1 })
		)

		function render(t: DateTime) {
			return `${t.monthShort} ${t.day}, ${t.weekdayShort} at ${t.toLocaleString(DateTime.TIME_SIMPLE)}`
		}

		let index = 0
		for (const event of planner) {
			console.log(`${event.description}\n\t${render(event.start)} until ${render(event.stop)}`)
			const expectedEvent = expected[index++]
			expect(expectedEvent.start.toString()).toEqual(event.start.toString())
			expect(expectedEvent.stop.toString()).toEqual(event.stop.toString())
			expect(expectedEvent.description).toEqual(event.description)
			expect(expectedEvent.info).toEqual(event.info)
		}
	})
})