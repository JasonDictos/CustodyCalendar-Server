import * as custody from "."
import { Duration, DateTime } from "luxon"

describe("planner.custody.Planner", function()  {
	test("3 Guardians", async function() {
		// January 2021
		// SU MO TU WE TH FR SA
		//                01 02
		// 03 04 05 06 07 08 09
		// 10 11 12 13 14 15 16
		// 17 18 19 20 21 22 23
		// 24 25 26 27 28 29 30
		// 31

		const plan: custody.Plan[] = [
			{
				entity: "dad1",
				months: "Jan-Dec",
				weekdays: "Mon-Tue",
				start: {
					timeOfDay: "07:45",
					// Kids are dropped off (To dads, by mom)
					exchange: custody.Exchange.Dropoff
				},
				stop: {
					timeOfDay: "17:00",
					exchange: custody.Exchange.Pickup
				},
				description: "Time with dad1",
			},
			{
				entity: "dad2",
				months: "Jan-Dec",
				weekdays: "Tue-Fri",
				start: {
					timeOfDay: "17:00",
					// Kids are picked up (from dads, by mom)
					exchange: custody.Exchange.Pickup
				},
				stop: {
					timeOfDay: "17:00",
					exchange: custody.Exchange.Dropoff
				},
				description: "Time with dad2",
			},
			{
				entity: "mom1",
				months: "Jan-Dec",
				weekdays: "Fri-Mon",
				start: {
					timeOfDay: "17:00",
					exchange: custody.Exchange.Pickup
				},
				stop: {
					timeOfDay: "07:45",
					exchange: custody.Exchange.Dropoff
				},
				description: "Time with mom1",
			}
		]

		// Expected occurrances
		const expected: custody.Occurrance[] = [
			{
				start: DateTime.fromISO("2021-01-01T17:00:00"),
				stop: DateTime.fromISO("2021-01-04T07:45:00"),
				description: "Time with mom1",
				info: {
					entity: "mom1",
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-04T07:45:00"),
				stop: DateTime.fromISO("2021-01-05T17:00:00"),
				description: "Time with dad1",
				info: {
					entity: "dad1",
					exchange: custody.Exchange.Dropoff
				}
			},
			{
				start: DateTime.fromISO("2021-01-05T17:00:00"),
				stop: DateTime.fromISO("2021-01-08T17:00:00"),
				description: "Time with dad2",
				info: {
					entity: "dad2",
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-08T17:00:00"),
				stop: DateTime.fromISO("2021-01-11T07:45:00"),
				description: "Time with mom1",
				info: {
					entity: "mom1",
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-11T07:45:00"),
				stop: DateTime.fromISO("2021-01-12T17:00:00"),
				description: "Time with dad1",
				info: {
					entity: "dad1",
					exchange: custody.Exchange.Dropoff
				}
			},
			{
				start: DateTime.fromISO("2021-01-12T17:00:00"),
				stop: DateTime.fromISO("2021-01-15T17:00:00"),
				description: "Time with dad2",
				info: {
					entity: "dad2",
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-15T17:00:00"),
				stop: DateTime.fromISO("2021-01-18T07:45:00"),
				description: "Time with mom1",
				info: {
					entity: "mom1",
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-18T07:45:00"),
				stop: DateTime.fromISO("2021-01-19T17:00:00"),
				description: "Time with dad1",
				info: {
					entity: "dad1",
					exchange: custody.Exchange.Dropoff
				}
			},
			{
				start: DateTime.fromISO("2021-01-19T17:00:00"),
				stop: DateTime.fromISO("2021-01-22T17:00:00"),
				description: "Time with dad2",
				info: {
					entity: "dad2",
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-22T17:00:00"),
				stop: DateTime.fromISO("2021-01-25T07:45:00"),
				description: "Time with mom1",
				info: {
					entity: "mom1",
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-25T07:45:00"),
				stop: DateTime.fromISO("2021-01-26T17:00:00"),
				description: "Time with dad1",
				info: {
					entity: "dad1",
					exchange: custody.Exchange.Dropoff
				}
			},
			{
				start: DateTime.fromISO("2021-01-26T17:00:00"),
				stop: DateTime.fromISO("2021-01-29T17:00:00"),
				description: "Time with dad2",
				info: {
					entity: "dad2",
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-29T17:00:00"),
				stop: DateTime.fromISO("2021-02-01T07:45:00"),
				description: "Time with mom1",
				info: {
					entity: "mom1",
					exchange: custody.Exchange.Pickup
				}
			}
		]

		// Create a planner for January 1st 2021, out to 1 month
		const planner = new custody.Planner(
			plan,
			DateTime.fromISO("2021-01-01"),
			Duration.fromObject({ month: 1 })
		)

		function render(t: DateTime) {
			return `${t.monthShort} ${t.day}, ${t.weekdayShort} at ${t.toLocaleString(DateTime.TIME_SIMPLE)}`
		}

		// Now we can iterate the occurrances
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