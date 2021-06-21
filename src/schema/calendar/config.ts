import "../env"
import parseDbUrl from "parse-database-url"

export namespace Database {
	export const url = process.env.CALENDAR_DATABASE_URL
	export const config = parseDbUrl(url)
	export const { database, user, name, username, password, hostname, host, port, schema } = config
	export const poolMin = Number(process.env.DATABASE_POOL_MIN || "0")
	export const poolMax = Number(process.env.DATABASE_POOL_MAX || "10")
	export const poolIdle = Number(process.env.DATABASE_POOL_IDLE || "10000")
}

export const Provider = {
	client: "postgresql",
	directory: `${__dirname}/migrations`,
	connection: {
		schema: Database.schema || "public",
		host: Database.host,
		database: Database.database,
		user: Database.user,
		password: Database.password,
		port: Database.port,
	},
	pool: {
		min: Database.poolMin,
		max: Database.poolMax
	},
	migrations: {
		database: Database.database,
		schemaName: Database.schema || "public",
		tableName: "KnexMigrations"
	},
}