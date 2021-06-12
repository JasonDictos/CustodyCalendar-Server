import { MethodMapping } from "@open-rpc/server-js/build/router"
import { DateTime } from "luxon"
import * as schema from "../../schema/calendar"

// The instance of a portal api server, references the poral model
// services all portal apis, conforms to openrpc api specification
export class Calendar {
	constructor(
		private mSchema: schema.Schema) {
	}

	async listEventsInRange(start: DateTime, stop: DateTime): Promise<schema.plan.Row[]> {
		throw new Error("@@TODO")
	}

	get methods(): MethodMapping {
		return {
			login: this.listEventsInRange.bind(this)
		}
	}
}