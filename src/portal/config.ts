import parseDbUrl from 'parse-database-url'
import dotenv from 'dotenv'

dotenv.config()

export namespace Database {
	export const schema = 'portal'
	export const url = process.env.DATABASE_URL
	export const config = parseDbUrl(url)
	export const {database, user, name, username, password, hostname, host, port} = config
	export const poolMin = Number(process.env.DATABASE_POOL_MIN || '0')
	export const poolMax = Number(process.env.DATABASE_POOL_MAX || '10')
	export const poolIdle = Number(process.env.DATABASE_POOL_IDLE || '10000')
}

export namespace Server {
	export const port = Number(process.env.PORTAL_PORT || '8000')
	export const bodyLimit = '100kb'
	export const corsHeaders = ['Link']
	export const isDev = process.env.NODE_ENV === 'development'
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
	idle: Database.poolIdle
  },
  migrations: {
	tableName: 'KnexMigrations',
  },
}