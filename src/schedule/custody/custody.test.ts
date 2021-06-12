import { DateTime } from "luxon"
import * as custody from "./"

describe("event.custody", function()  {
	// Start of the agreement
	const Start = DateTime.fromISO("2020-08-21T18:00:00")
	const TimeZone = "America/Los_Angeles"

	// Kids and parents
	const Guardians = ["mom", "dad"]

	// Series list, in order of precedence
	const Events: custody.Plan[] = [{
		guardian: "alternate",
		months: "Jan-Dec",
		days: "Fri-Mon",
		start: "18:00",
		stop: "08:00"
	}, {
		guardian: "alternate",
		months: "Jan-Dec",
		days: "Fri-Mon",
		start: "17:00",
		stop: "07:45"
	}, {
		guardian: "dad",
		months: "Sep-May",
		days: "Wed-Fri",
		start: "07:45",
		stop: "18:00"
	}, {
		guardian: "mom",
		months: "Sep-May",
		days: "Mon-Wed",
		start: "08:00",
		stop: "07:45"
	}, {
		guardian: "mom",
		months: "Jun-Aug",
		days: "Mon-Wed",
		start: "08:00",
		stop: "07:45"
	}, {
		guardian: "dad",
		months: "Jun-Aug",
		days: "Wed-Thu",
		start: "07:45",
		stop: "17:00"
	}, {
		guardian: "mom",
		months: "Jun-Aug",
		days: "Thu-Fri",
		start: "17:00",
		stop: "07:45"
	}, {
		guardian: "dad",
		months: "Jun-Aug",
		days: "Fri-Fri",
		start: "07:45",
		stop: "18:00"
	}]

	test("Mistake #1", async function() {
		const scheduler = new custody.Scheduler(
			Start,
			TimeZone,
			Guardians,
			Events
		)

		for (const event of scheduler) {
			console.log(event.name)
			break
		}
	})
})