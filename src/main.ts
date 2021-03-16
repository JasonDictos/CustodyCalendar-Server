import { SQLite } from './db/SQLite.js';

(async function() {
    const db = new SQLite();
    await db.connect();
})();