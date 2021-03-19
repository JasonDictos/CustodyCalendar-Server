import * as entity from '.';
import * as config from '../../util/testconfig';
import Knex from 'knex';

describe('Test entity rows', function () {	
	const connection = Knex(config.Knex);

	afterAll(() => {
		return connection.destroy();
	});
	test('Insertion', async function () {
		const table = await entity.table(config.Database.schema, connection);

		await expect(table.count()).resolves.toBe(0);

		await table.add({
			type: entity.Type.Info,
			subType: entity.SubType.Location,
			body: {
				address: '584 Omaha Ave. Clovis, CA 93611'
			} as entity.Location}
		);

		await expect(table.count()).resolves.toBe(1);

		const users = await table.list();
		expect(users.length).toBe(1);
	});
});