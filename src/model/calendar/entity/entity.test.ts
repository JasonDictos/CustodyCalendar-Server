import { SQLite, Connection } from '../../db';
import { testPath } from '../../../util/testutil';
import * as entity from './';

describe("entity", function() {
	test("insert select", async function() {
		const db = new SQLite({ filename: testPath('entity.db') });
		await entity.provision(db);
	});
});