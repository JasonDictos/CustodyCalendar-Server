import * as db from '../db';
import * as entity from './entity';
import * as event from './event';

export async function provision(conn: db.Connection): Promise<db.Connection> {
	entity.provision(conn);
	event.provision(conn);
	return conn;
}
