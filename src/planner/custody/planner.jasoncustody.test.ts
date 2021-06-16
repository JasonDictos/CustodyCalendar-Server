import * as custody from "."
import { Duration, DateTime } from "luxon"

describe("planner.custody.Planner", function()  {
	test("JasonCustody", async function() {
		// This represents jasons actual legal agreement minus holidays
		// Joint custody:
		// Jason and Jen share joint custody of the kids every other weekend starting on
		// the agreement date of 2020-08-21T18:00:00, and weekend is defined as a friday
		// at 6:00PM through a monday at either 7:45AM (school year Sep-May) or 8:00 AM (summer  Jun-Aug)
		// Jason's Custody
		// During the school year (Sep-May) Jason has the kids every week
		// starting on Wed mornings (7:45AM) and ending on Friday Evenings (6:00PM)
		// During the summer year (Jun-Aug) Jason has the kids every Wed (7:45AM)
		// through Thursday (5:00PM), and then again on Friday (8:00AM)
		// Jen's Custody
		// During the school year (Sep-May) Jen has the kids every week
		// starting on Monday (7:45 AM) through Wed (7:45AM).
		// During the summer year (Jun-Aug) Jen has the kids every Thursday (5:00PM)
		// through Friday morning at (8:00 AM)
		const plan: custody.Plan[] = [
			{
				// Weekends school - alternating
				entity: "dad,mom",
				months: "Sep-May",
				weekdays: "Fri-Mon",
				start: {
					timeOfDay: "18:00",
					exchange: custody.Exchange.Dropoff
				},
				stop: {
					timeOfDay: "07:45",
					exchange: custody.Exchange.Dropoff
				},
				description: "Weekend with %entity%",
			},
			{
				// Weekends summer - alternating
				entity: "dad,mom",
				months: "Jun-Aug",
				weekdays: "Fri-Mon",
				start: {
					timeOfDay: "17:00",
					exchange: custody.Exchange.Dropoff
				},
				stop: {
					timeOfDay: "08:00",
					exchange: custody.Exchange.Dropoff
				},
				description: "Weekend with %entity%",
			},
			{
				// School repeating custody - mom
				entity: "mom",
				months: "Sep-May",
				weekdays: "Mon-Wed",
				start: {
					timeOfDay: "07:45",
					exchange: custody.Exchange.Dropoff
				},
				stop: {
					timeOfDay: "07:45",
					exchange: custody.Exchange.Dropoff
				},
				description: "School mon-wed with %entity%",
			},
			{
				// Summer repeating custody - mom
				entity: "mom",
				months: "Jun-Aug",
				weekdays: "Mon-Wed",
				start: {
					timeOfDay: "08:00",
					exchange: custody.Exchange.Dropoff
				},
				stop: {
					timeOfDay: "08:00",
					exchange: custody.Exchange.Dropoff
				},
				description: "Summer mon-wed with %entity%",
			},
			{
				// School repeating custody - dad
				entity: "dad",
				months: "Sep-May",
				weekdays: "Wed-Fri",
				start: {
					timeOfDay: "07:45",
					exchange: custody.Exchange.Dropoff
				},
				stop: {
					timeOfDay: "18:00",
					exchange: custody.Exchange.Pickup
				},
				description: "School wed-fri with %entity%",
			},
			{
				// Summer repeating custody - dad
				entity: "mom",
				months: "Jun-Aug",
				weekdays: "Thu-Fri",
				start: {
					timeOfDay: "17:00",
					exchange: custody.Exchange.Pickup
				},
				stop: {
					timeOfDay: "08:00",
					exchange: custody.Exchange.Dropoff
				},
				description: "Summer thursday nights with %entity%",
			},
			{
				// Summer repeating custody - dad
				entity: "dad",
				months: "Jun-Aug",
				weekdays: "Wed-Thu",
				start: {
					timeOfDay: "08:00",
					exchange: custody.Exchange.Dropoff
				},
				stop: {
					timeOfDay: "17:00",
					exchange: custody.Exchange.Pickup
				},
				description: "Summer wed-thu with %entity%",
			},
			{
				// Summer repeating custody - dad
				entity: "dad",
				months: "Jun-Aug",
				weekdays: "Fri",
				start: {
					timeOfDay: "08:00",
					exchange: custody.Exchange.Dropoff
				},
				stop: {
					timeOfDay: "17:00",
					exchange: custody.Exchange.Pickup
				},
				description: "Fridays with %entity%",
			}]

		// Expected occurrances
		const expected: custody.Occurrance[] = [
			{
				start: DateTime.fromISO("2020-08-21T07:45:00"),
				stop: DateTime.fromISO("2021-08-24T18:00:00"),
				description: "Time with dad",
				info: {
					entity: "dad",
					exchange: custody.Exchange.Pickup
				}
			},
			{
				start: DateTime.fromISO("2020-08-24T18:00:00"),
				stop: DateTime.fromISO("2021-08-24T18:00:00"),
				description: "Time with dad",
				info: {
					entity: "dad",
					exchange: custody.Exchange.Pickup
				}
			}
		]

		const planner = new custody.Planner(
			plan,
			DateTime.fromISO("2020-08-21T18:00:00"),
			DateTime.fromISO("2021-06-15T18:00:00")
		)

		function render(t: DateTime) {
			return `${t.year}: ${t.monthShort} ${t.day}, ${t.weekdayShort} at ${t.toLocaleString(DateTime.TIME_SIMPLE)}`
		}

		let e
		for (const event of planner) {
			console.log(`${event.description}\n\t${render(event.start)} until ${render(event.stop)}`)
		}
	})
})