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

		const dadId = await model.insert({ type: entity.Type.Location, fields: {
			name: "Dad's House",
			address: "1234"
		} as entity.Location})

		console.info(`Dad's house ${dadId}`)

		await expect(model.count()).resolves.toBe(1)
		let entities = await model.select()
		expect(entities.length).toBe(1)
		let location = entities[0].fields as entity.Location
		expect(location.address).toBe("1234")
		expect(location.name).toBe("Dad's House")

		let row = await model.get(dadId)
		expect(row.id).toBe(dadId)
		expect(row.type).toBe(entity.Type.Location)
		expect(row.fields).toEqual(location)

		const momId = await model.insert({ type: entity.Type.Location, fields: {
			name: "Moms's House",
			address: "2345"
		} as entity.Location})

		await expect(model.count()).resolves.toBe(2)
		entities = await model.select()
		expect(entities.length).toBe(2)

		console.info(`Moms's house ${momId}`)

		row = await model.get(momId)
		expect(row.id).toBe(momId)
		expect(row.type).toBe(entity.Type.Location)
		location = row.fields as entity.Location
		expect(location.address).toBe("2345")
		expect(location.name).toBe("Moms's House")

		await model.delete(momId)
		await expect(model.count()).resolves.toBe(1)
		await model.delete(dadId)
		await expect(model.count()).resolves.toBe(0)
	})
})