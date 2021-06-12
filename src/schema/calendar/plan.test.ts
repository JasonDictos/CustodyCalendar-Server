import * as schema from "./schema"
import * as config from "./config"
import * as plan from "./plan"
import Knex from "knex"

describe("schema.calendar.plan", function()  {
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
		await db.plan.delete()
	})

	afterAll(async () => {
		conn.destroy()
	})

	test("General", async function()   {
		await expect(db.plan.count()).resolves.toBe(0)

		for (const s of Series) {
			const [guardian, months, days, start, stop] = s.split(",")
			await db.plan.insert({
				type: plan.Type.Custody,
				group: "Mistake #1",
				fields: {
					guardian,
					months,
					days,
					start,
					stop
				} as plan.Custody
			})
		}
	})
})