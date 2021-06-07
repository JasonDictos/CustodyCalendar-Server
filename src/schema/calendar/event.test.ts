import * as schema from "./schema"
import * as config from "./config"
import Knex from "knex"

describe("schema.calendar.event", function()  {
	let conn: ReturnType<typeof Knex>
	let db: schema.Schema

	beforeAll(async () => {
		conn = Knex(config.Provider)
		db = schema.create(conn)
		await db.event.delete()
		await db.entity.delete()
	})

	afterAll(async () => {
		conn.destroy()
	})
})