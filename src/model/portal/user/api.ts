import { Connection } from '../../db';

export async function deploy(conn: Connection) {
    conn.schema.hasTable('user').then(function(exists) {
        if (!exists) {
            conn.schema.createTable('user', function (table){
                table.increments('id').primary();
                table.string("type", 64);
                table.text("body", 1024 * 1024);
            });
        }
    });
}