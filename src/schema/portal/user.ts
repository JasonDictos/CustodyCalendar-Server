import * as table from "../model"
import { Knex } from "knex"

export enum Type {
	External = "external",
	Builtin = "builtin",
}

export interface Fields {
	name: string;
}

export interface External extends Fields {
	oauth2: string;
}

export interface Builtin extends Fields {
	password_hash: string;
}

export type Row = table.Row<Type, Fields>
export class Model extends table.Model<Type, Fields> { 
	constructor(conn: Knex) {
		super(conn, "user")
	}
}
