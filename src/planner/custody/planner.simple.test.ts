import * as custody from "."
import { Duration, DateTime } from "luxon"

describe("planner.custody.Planner", function()  {
	test("Explode1", async function() {
		const exploded = custody.Planner.explodePlan({
			entity: "bobo",
			months: "Sep-May",
			weekdays: "Fri-Wed",
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
			description: "Time with dad",
		})

		// mon(1) tue(2) wed(3) thu(4) fri(5) sat(6) sun(7)
		// Fri-Wed should include 1, 2, 3, !4, 5, 6, 7
		expect(exploded.weekdays.length).toBe(6)
		expect(exploded.weekdays).toContain(1)
		expect(exploded.weekdays).toContain(2)
		expect(exploded.weekdays).toContain(3)
		expect(exploded.weekdays).not.toContain(4)
		expect(exploded.weekdays).toContain(5)
		expect(exploded.weekdays).toContain(6)
		expect(exploded.weekdays).toContain(7)

		// jan(1) feb(2) mar(3) apr(4) may(5) jun(6) jul(7) aug(8) sep(9) oct(10) nov(11) dec(12)
		// Sep-May should include 1, 2, 3, 4, 5, !6, !7, !8, 9, 10, 11, 12,
		expect(exploded.months.length).toBe(9)
		expect(exploded.months).toContain(1)
		expect(exploded.months).toContain(2)
		expect(exploded.months).toContain(3)
		expect(exploded.months).toContain(4)
		expect(exploded.months).toContain(5)
		expect(exploded.months).not.toContain(6)
		expect(exploded.months).not.toContain(7)
		expect(exploded.months).not.toContain(8)
		expect(exploded.months).toContain(9)
		expect(exploded.months).toContain(10)
		expect(exploded.months).toContain(11)
		expect(exploded.months).toContain(12)
	})

	test("Explode2", async function() {
		const exploded = custody.Planner.explodePlan({
			entity: "mom",
			months: "Jan-Dec",
			weekdays: "Fri-Mon",
			start: {
				timeOfDay: "17:00",
				// Kids are picked up (from dads, by mom)
				exchange: custody.Exchange.Pickup
			},
			stop: {
				timeOfDay: "07:45",
				// Kids are dropped off (to dads, by mom)
				exchange: custody.Exchange.Dropoff
			},
			description: "Time with mom",
		})

		// mon(1) tue(2) wed(3) thu(4) fri(5) sat(6) sun(7)
		// Fri-Mon should include 5, 6, 7, 1
		expect(exploded.weekdays.length).toBe(4)
		expect(exploded.weekdays).toContain(1)
		expect(exploded.weekdays).not.toContain(2)
		expect(exploded.weekdays).not.toContain(3)
		expect(exploded.weekdays).not.toContain(4)
		expect(exploded.weekdays).toContain(5)
		expect(exploded.weekdays).toContain(6)
		expect(exploded.weekdays).toContain(7)

		// jan(1) feb(2) mar(3) apr(4) may(5) jun(6) jul(7) aug(8) sep(9) oct(10) nov(11) dec(12)
		// Jan-Dec should include 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
		expect(exploded.months.length).toBe(12)
		expect(exploded.months).toContain(1)
		expect(exploded.months).toContain(2)
		expect(exploded.months).toContain(3)
		expect(exploded.months).toContain(4)
		expect(exploded.months).toContain(5)
		expect(exploded.months).toContain(6)
		expect(exploded.months).toContain(7)
		expect(exploded.months).toContain(8)
		expect(exploded.months).toContain(9)
		expect(exploded.months).toContain(10)
		expect(exploded.months).toContain(11)
		expect(exploded.months).toContain(12)
	})

	test("Explode3", async function() {
		const exploded = custody.Planner.explodePlan({
			entity: "mom",
			months: "Jan-Dec",
			weekdays: "Tue-Fri",
			start: {
				timeOfDay: "17:00",
				// Kids are picked up (from dads, by mom)
				exchange: custody.Exchange.Pickup
			},
			stop: {
				timeOfDay: "07:45",
				// Kids are dropped off (to dads, by mom)
				exchange: custody.Exchange.Dropoff
			},
			description: "Time with mom",
		})

		// mon(1) tue(2) wed(3) thu(4) fri(5) sat(6) sun(7)
		// Tue-Fri should include 2, 3, 4, 5
		expect(exploded.weekdays.length).toBe(4)
		expect(exploded.weekdays).not.toContain(1)
		expect(exploded.weekdays).toContain(2)
		expect(exploded.weekdays).toContain(3)
		expect(exploded.weekdays).toContain(4)
		expect(exploded.weekdays).toContain(5)
		expect(exploded.weekdays).not.toContain(6)
		expect(exploded.weekdays).not.toContain(7)

		// jan(1) feb(2) mar(3) apr(4) may(5) jun(6) jul(7) aug(8) sep(9) oct(10) nov(11) dec(12)
		// Jan-Dec should include 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
		expect(exploded.months.length).toBe(12)
		expect(exploded.months).toContain(1)
		expect(exploded.months).toContain(2)
		expect(exploded.months).toContain(3)
		expect(exploded.months).toContain(4)
		expect(exploded.months).toContain(5)
		expect(exploded.months).toContain(6)
		expect(exploded.months).toContain(7)
		expect(exploded.months).toContain(8)
		expect(exploded.months).toContain(9)
		expect(exploded.months).toContain(10)
		expect(exploded.months).toContain(11)
		expect(exploded.months).toContain(12)
	})

	test("Simple", async function() {
		// January 2021
		// SU MO TU WE TH FR SA
		//                01 02
		// 03 04 05 06 07 08 09
		// 10 11 12 13 14 15 16
		// 17 18 19 20 21 22 23
		// 24 25 26 27 28 29 30
		// 31

		// Simple non layered plan definition starting on the month boundary
		const plan: custody.Plan[] = [
			{
				entity: "dad",
				months: "Jan-Dec",
				weekdays: "Mon-Fri",
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
				description: "Time with dad",
			},
			{
				entity: "mom",
				months: "Jan-Dec",
				weekdays: "Fri-Mon",
				start: {
					timeOfDay: "17:00",
					// Kids are picked up (from dads, by mom)
					exchange: custody.Exchange.Pickup
				},
				stop: {
					timeOfDay: "07:45",
					// Kids are dropped off (to dads, by mom)
					exchange: custody.Exchange.Dropoff
				},
				description: "Time with mom",
			}]


		// Expected occurrences
		const expected: custody.Occurrence[] = [
			{
				start: DateTime.fromISO("2021-01-01T17:00:00"),
				stop: DateTime.fromISO("2021-01-04T07:45:00"),
				description: "Time with mom",
				info: {
					entity: "mom",
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-04T07:45:00"),
				stop: DateTime.fromISO("2021-01-08T17:00:00"),
				description: "Time with dad",
				info: {
					entity: "dad",
					exchange: custody.Exchange.Dropoff
				}
			},
			{
				start: DateTime.fromISO("2021-01-08T17:00:00"),
				stop: DateTime.fromISO("2021-01-11T07:45:00"),
				description: "Time with mom",
				info: {
					entity: "mom",
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-11T07:45:00"),
				stop: DateTime.fromISO("2021-01-15T17:00:00"),
				description: "Time with dad",
				info: {
					entity: "dad",
					exchange: custody.Exchange.Dropoff
				}
			},
			{
				start: DateTime.fromISO("2021-01-15T17:00:00"),
				stop: DateTime.fromISO("2021-01-18T07:45:00"),
				description: "Time with mom",
				info: {
					entity: "mom",
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-18T07:45:00"),
				stop: DateTime.fromISO("2021-01-22T17:00:00"),
				description: "Time with dad",
				info: {
					entity: "dad",
					exchange: custody.Exchange.Dropoff
				}
			},
			{
				start: DateTime.fromISO("2021-01-22T17:00:00"),
				stop: DateTime.fromISO("2021-01-25T07:45:00"),
				description: "Time with mom",
				info: {
					entity: "mom",
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2021-01-25T07:45:00"),
				stop: DateTime.fromISO("2021-01-29T17:00:00"),
				description: "Time with dad",
				info: {
					entity: "dad",
					exchange: custody.Exchange.Dropoff
				}
			},
			{
				start: DateTime.fromISO("2021-01-29T17:00:00"),
				stop: DateTime.fromISO("2021-02-01T07:45:00"),
				description: "Time with mom",
				info: {
					entity: "mom",
					exchange: custody.Exchange.Pickup
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
			console.log(`${index} ${event.description}\n\t${render(event.start)} until ${render(event.stop)}`)
			const expectedEvent = expected[index++]
			expect(expectedEvent.start.toString()).toEqual(event.start.toString())
			expect(expectedEvent.stop.toString()).toEqual(event.stop.toString())
			expect(expectedEvent.description).toEqual(event.description)
			expect(expectedEvent.info).toEqual(event.info)
		}
	})
})