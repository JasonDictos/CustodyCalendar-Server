import * as entity from "./entity"
import * as event from "./event"
import * as schema from "./schema"
import * as config from "./config"
import { DateTime } from 'luxon'
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

	test("Events at a location", async function()   {
		const dadsHouseId = await db.entity.insert({ type: entity.Type.Location, fields: {
			name: "Dad's House",
			address: "1234"
		} as entity.Location})

		const dadId = await db.entity.insert({ type: entity.Type.Guardian, fields: {
			name: "Jason Dictos",
			locations
		} as entity.Guardian})

		const momsHouseId = await db.entity.insert({ type: entity.Type.Location, fields: {
			name: "Mom's House",
			address: "1234"
		} as entity.Location})

		const dadId = await model.insert({
			type: event.Type.Visitation,
			name: "Time with Dad",
			start: DateTime.utc(1900, 1, 8, 5),
			stop: DateTime.utc(1900, 1, 9, 18),
			locationId: dadsId,
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