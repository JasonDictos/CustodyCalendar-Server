import * as entity from "./entity"
import * as config from "./config"
import Knex from "knex"
import { DateTime } from "luxon"

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

		const stella: Omit<entity.Row, "id"> = {
			type: entity.Type.Dependent,
			name: "Stella Dictos",
			fields: {
				birthday: DateTime.fromFormat("MM/dd/yy", "03/27/13"),
				email: "marcus@custodycalendar.com",
				numbers: [{ type: "Cell", number: "559-515-1151" }]
			} as entity.Dependent
		}

		const marcus: Omit<entity.Row, "id"> = {
			type: entity.Type.Dependent,
			name: "Marcus Dictos",
			fields: {
				birthday: DateTime.fromFormat("MM/dd/yy", "08/10/11"),
				email: "marcus@custodycalendar.com",
				numbers: [{ type: "Cell", number: "559-515-1151" }]
			} as entity.Dependent
		}

		const stellaId = await model.insert(stella)
		const marcusId = await model.insert(marcus)

		const dad: Omit<entity.Row, "id"> = {
			type: entity.Type.Guardian,
			name: "Jason Dictos",
			fields: {
				email: "jason@custodycalendar.com",
				numbers: [{ type: "Cell", number: "408-222-1192"}],
				locations: [{ name: "Dad's House", address: "1234 w hollywood blvd" }],
				dependentIds: [marcusId, stellaId]
			} as entity.Guardian
		}

		const mom: Omit<entity.Row, "id"> = {
			type: entity.Type.Guardian,
			name: "Barbra Walters",
			fields: {
				email: "bwalters@custodycalendar.com",
				numbers: [{ type: "Cell", number: "555-222-1192"}],
				locations: [{ name: "Her House", address: "1234 w martin luther blvd" }],
				dependentIds: [marcusId, stellaId]
			} as entity.Guardian
		}

		const dadId = await model.insert(dad)
		const momId = await model.insert(mom)

		await expect(model.count()).resolves.toBe(4)
		const entities = await model.select()
		expect(entities.length).toBe(4)

		let row = await model.get(dadId)
		expect(row.id).toBe(dadId)
		expect(row.type).toBe(dad.type)
		expect(row.name).toBe(dad.name)
		expect(row.fields).toEqual(dad.fields)

		row = await model.get(momId)
		expect(row.id).toBe(momId)
		expect(row.type).toBe(mom.type)
		expect(row.name).toBe(mom.name)
		expect(row.fields).toEqual(mom.fields)

		row = await model.get(stellaId)
		expect(row.id).toBe(stellaId)
		expect(row.type).toBe(stella.type)
		expect(row.name).toBe(stella.name)
		expect(row.fields).toEqual(stella.fields)

		row = await model.get(marcusId)
		expect(row.id).toBe(marcusId)
		expect(row.type).toBe(marcus.type)
		expect(row.name).toBe(marcus.name)
		expect(row.fields).toEqual(marcus.fields)

		let dependents = await model.selectDependents(momId, { birthday: stella.fields.birthday })
		expect(dependents.length).toBe(1)
		expect(dependents[0].name).toBe(stella.name)
		expect(dependents[0].fields).toBe(stella.fields)

		dependents = await model.selectDependents(momId, { birthday: marcus.fields.birthday })
		expect(dependents.length).toBe(1)
		expect(dependents[0].name).toBe(marcus.name)
		expect(dependents[0].fields).toBe(marcus.fields)

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