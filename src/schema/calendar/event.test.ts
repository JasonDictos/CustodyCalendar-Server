import * as entity from "./entity"
import * as event from "./event"
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

	test("Events at a location", async function()   {
		const dadId = await db.entity.insert({
			type: entity.Type.Guardian,
			name: "Jason Dictos",
			fields: {
				locations: [{
					name: "Dad's House",
					address: "1234"
				}]
			} as entity.Guardian})

		const schoolId = await db.entity.insert({
			type: entity.Type.Group,
			name: "Cedarwood Elementary",
			fields: {
				locations: [{
					name: "School",
					address: "9123"
				}]
			}
		})

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
				birthday: new Date(2013, 3, 27)
			} as entity.Dependent
		})

		const marcusId = await db.entity.insert({
			type: entity.Type.Dependent,
			name: "Marcus Dictos",
			fields: {
				email: "marcus@dictos.com",
				birthday: new Date(2011, 8, 10)
			} as entity.Dependent
		})

		await db.event.insert({
			type: event.Type.Visitation,
			name: "Time with Mom",
			start: new Date(2021, 3, 8, 3, 10),
			stop: new Date(2021, 3, 8, 4, 10),
			guardianId: dadId,
			groupId: schoolId,
			fields: {
				dependentIds: [marcusId, stellaId]
			}
		})

		await db.event.insert({
			type: event.Type.Activity,
			name: "Soccer Practice",
			start: new Date(2021, 3, 5, 3, 10).toISOString(),
			stop: new Date(2021, 3, 5, 4, 10).toISOString(),
			guardianId: dadId,
			groupId: schoolId,
			fields: {
				dependentIds: [marcusId, stellaId]
			}
		})
	})
})