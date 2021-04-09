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

		const momVisitId = await db.event.insert({
			type: event.Type.Visitation,
			name: "Time with Mom",
			start: "April 8, 2021 18:00:00-7",
			stop: "April 14, 2021 7:45:00-7",
			guardianId: momId,
			fields: {
				dependentIds: [marcusId, stellaId]
			}
		})

		const dadVisitId = await db.event.insert({
			type: event.Type.Visitation,
			name: "Time with Dad",
			start: "April 7, 2021 7:45-7",
			stop: "April 9, 2021 18:00-7",
			guardianId: dadId,
			fields: {
				dependentIds: [marcusId, stellaId]
			}
		})

		const dadEventId = await db.event.insert({
			type: event.Type.Activity,
			name: "Soccer Practice",
			start: "April 8, 2021 15:10:00-7",
			stop: "April 8, 2021 16:10:00-7",
			guardianId: dadId,
			groupId: schoolId,
			fields: {
				dependentIds: [marcusId, stellaId]
			}
		})

		let row = await db.event.get(dadVisitId)
		expect(row.type).toBe(event.Type.Visitation)
		expect(row.name).toEqual("Time with Dad")
		expect(row.start).toEqual(new Date("April 7, 2021 07:45-7"))
		expect(row.stop).toEqual(new Date("April 9, 2021 18:00-7"))
		expect(row.guardianId).toEqual(dadId)
		expect(row.groupId).toBeNull()
		expect(row.fields.dependentIds).toEqual([marcusId, stellaId])

		row = await db.event.get(momVisitId)
		expect(row.type).toBe(event.Type.Visitation)
		expect(row.name).toEqual("Time with Mom")
		expect(row.start).toEqual(new Date("April 8, 2021 18:00-7"))
		expect(row.stop).toEqual(new Date("April 14, 2021 07:45-7"))
		expect(row.guardianId).toEqual(momId)
		expect(row.groupId).toBeNull()
		expect(row.fields.dependentIds).toEqual([marcusId, stellaId])

		row = await db.event.get(dadEventId)
		expect(row.type).toBe(event.Type.Activity)
		expect(row.name).toEqual("Soccer Practice")
		expect(row.start).toEqual(new Date("April 8, 2021 15:10-7"))
		expect(row.stop).toEqual(new Date("April 8, 2021 16:10-7"))
		expect(row.guardianId).toEqual(dadId)
		expect(row.groupId).toEqual(schoolId)
		expect(row.fields.dependentIds).toEqual([marcusId, stellaId])
	})
})