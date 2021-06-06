import * as entity from "./entity"
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

	test("General", async function()   {
		await expect(db.entity.count()).resolves.toBe(0)

		const dadId = await db.entity.insert({
			type: entity.Type.Guardian,
			name: "Jason Dictos",
			fields: {
				locations: [{
					name: "Dad's House",
					address: "1234"
				}]
			} as entity.Guardian})

		const momId = await db.entity.insert({
			type: entity.Type.Guardian,
			name: "Nej Dictos",
			fields: {
				locations: [{
					name: "House Dad Paid For",
					address: "5678"
				}]
			} as entity.Guardian})

		const stellaId = await db.entity.insert({
			type: entity.Type.Dependent,
			name: "Stella Dictos",
			fields: {
				email: "stella@dictos.com",
				birthday: new Date("2013-3-27").toISOString()
			} as entity.Dependent
		})

		const marcusId = await db.entity.insert({
			type: entity.Type.Dependent,
			name: "Marcus Dictos",
			fields: {
				email: "marcus@dictos.com",
				birthday: new Date("2011-8-10").toISOString()
			} as entity.Dependent
		})

		const model = db.entity

		await expect(model.count()).resolves.toBe(4)
		const entities = await model.select()
		expect(entities.length).toBe(4)

		let row = await model.get(dadId)
		expect(row.id).toBe(dadId)
		expect(row.type).toBe(entity.Type.Guardian)
		expect(row.name).toBe("Jason Dictos")
		expect(row.fields).toEqual({
			locations: [{
				name: "Dad's House",
				address: "1234"
			}]
		})

		row = await model.get(momId)
		expect(row.id).toBe(momId)
		expect(row.type).toBe(entity.Type.Guardian)
		expect(row.name).toBe("Nej Dictos")
		expect(row.fields).toEqual({
			locations: [{
				name: "House Dad Paid For",
				address: "5678"
			}]
		})

		row = await model.get(stellaId)
		expect(row.id).toBe(stellaId)
		expect(row.type).toBe(entity.Type.Dependent)
		expect(row.name).toBe("Stella Dictos")
		expect(row.fields).toEqual({
			email: "stella@dictos.com",
			birthday: new Date("2013-3-27").toISOString()
		})

		row = await model.get(marcusId)
		expect(row.id).toBe(marcusId)
		expect(row.type).toBe(entity.Type.Dependent)
		expect(row.name).toBe("Marcus Dictos")
		expect(row.fields).toEqual({
			email: "marcus@dictos.com",
			birthday: new Date("2011-8-10").toISOString()
		})

		// Showcase how you'd select dependents whose email matches something
		const res = await model.table.select("*").
			where("type", entity.Type.Dependent).
			whereRaw("fields->>'email' like '%dictos%'")
		expect(res.length).toBe(2)

		await model.delete(momId)
		await expect(model.count()).resolves.toBe(3)
		await model.delete(dadId)
		await expect(model.count()).resolves.toBe(2)
		await model.delete(marcusId)
		await expect(model.count()).resolves.toBe(1)
		await model.delete(stellaId)
		await expect(model.count()).resolves.toBe(0)
	}, 9999999999)
})