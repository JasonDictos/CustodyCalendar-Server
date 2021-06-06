import parseDbUrl from "parse-database-url"
import "./env"
import Knex from "knex"
import assert from "assert"

const key = process.argv[2]
const url = process.env[key]

assert(url)

console.info(`Provisioning ${key}:${url}`)

const {
	database,
	user, name, username, password,
	hostname, host, port,
	schema 
} = parseDbUrl(url)

let conn = Knex({
	client: "postgresql",
	connection: {
		user,
		password,
		host,
		port
	}
})
if (database) {
	try {
		await conn.raw("CREATE DATABASE ??", database)
		console.info("Created database", database)
	} catch (error) {
		if (error.code != "42P04")
			console.warn(error)
		else
			console.info("Database already exists", database)
	}
	conn.destroy()
	conn = Knex({
		client: "postgresql",
		connection: {
			user,
			password,
			host,
			port,
			database
		}
	})
}

if (schema) {
	try {
		await conn.raw("CREATE SCHEMA IF NOT EXISTS ??", schema)
		console.info("Created schema", schema, database ? `In database ${database}` : "")
	} catch (error) {
		console.warn(error)
	}
}

conn.destroy()