import parseDbUrl from 'parse-database-url'
import dotenv from 'dotenv'

dotenv.config({ path: './.test_env'})

export namespace Database {
	export const schema = process.env.CALENDAR_DATABASE_SCHEMA || Date.now().valueOf().toString(16)
	export const url = process.env.CALENDAR_DATABASE_URL || 'postgres://postgres@localhost:8888?password=password'
	export const config = parseDbUrl(url)
	export const {database, user, name, username, password, hostname, host, port} = config
	export const poolMin = Number(process.env.DATABASE_POOL_MIN || '0')
	export const poolMax = Number(process.env.DATABASE_POOL_MAX || '10')
}

export const Knex = {
  client: 'postgresql',
  connection: {
	host: Database.host,
	database: Database.database,
	user: Database.user,
	password: Database.password,
	port: Database.port,
  },
  pool: {
	min: Database.poolMin,
	max: Database.poolMax,
  },
  migrations: {
	tableName: 'KnexMigrations',
  },
}