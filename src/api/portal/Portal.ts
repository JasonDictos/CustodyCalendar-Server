import { MethodMapping } from "@open-rpc/server-js/build/router"
import { Schema } from "../../schema/portal"

// The instance of a portal api server, references the poral model
// services all portal apis, conforms to openrpc api specification
export class Portal {
	constructor(
		private mSchema: Schema) {
	}

	async login(name: string, password: string): Promise<string> {
		return Promise.resolve(`${name}-${password}`)
	}

	get methods(): MethodMapping {
		return {
			login: this.login.bind(this)
		}
	}
}