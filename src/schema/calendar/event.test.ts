import * as schema from "./schema"
import * as config from "./config"
import * as event from "./event"
import Knex from "knex"

describe("schema.calendar.event", function()  {
	let conn: ReturnType<typeof Knex>
	let db: schema.Schema

	const Series = [
		"alternate,Jan-Dec,Fri-Mon,18:00,08:00",
		"alternate,Jan-Dec,Fri-Mon,17:00,07:45",
		"dad,Sep-May,Wed-Fri,07:45,18:00",
		"mom,Sep-May,Mon-Wed,08:00,07:45",
		"mom,Jun-Aug,Mon-Wed,08:00,07:45",
		"dad,Jun-Aug,Wed-Thu,07:45,17:00",
		"mom,Jun-Aug,Thu-Fri,17:00,07:45",
		"dad,Jun-Aug,Fri-Fri,07:45,18:00"
	]

	beforeAll(async () => {
		conn = Knex(config.Provider)
		await conn.migrate.latest({ directory: config.Provider.directory })
		db = schema.create(conn)
		await db.event.delete()
	})

	afterAll(async () => {
		conn.destroy()
	})


	test("General", async function()   {
		await expect(db.event.count()).resolves.toBe(0)

		const guardianIds = ["mom", "dad"]
		const dependentIds = ["marcus", "stella"]

		for (const s of Series) {
			const [key, months, days, start, stop] = s.split(",")
			await db.event.insert({
				type: event.Type.Custody,
				group: "Mistake #1",
				fields: {
					guardianIds,
					dependentIds,
					key,
					months,
					days,
					start,
					stop
				} as event.Custody
			})
		}
	})
})