import * as entity from "./entity"
import * as config from "./config"
import Knex from "knex"

describe("schema.calendar.entity", function()  {
	let conn: ReturnType<typeof Knex>
	let model: entity.Model

	beforeAll(async () => {
		conn = Knex(config.Provider)
		model = new entity.Model(conn)
		await model.delete()
	})

	afterAll(async () => {
		conn.destroy()
	})

	test("Location", async function()   {
		await expect(model.count()).resolves.toBe(0)

		const id = await model.insert({ type: entity.Type.Location, fields: {
			name: "Dad's House",
			address: "1234"
		} as entity.Location})

		await expect(model.count()).resolves.toBe(1)
		const entities = await model.select()
		expect(entities.length).toBe(1)
		const location = entities[0].fields as entity.Location
		expect(location.address).toBe("1234")
		expect(location.name).toBe("Dad's House")

		const row = await model.get(id)
		expect(row.id).toBe(id)
		expect(row.type).toBe(entity.Type.Location)
		expect(row.fields).toEqual(location)

		await model.delete(id)

		await expect(model.count()).resolves.toBe(0)
	})
})