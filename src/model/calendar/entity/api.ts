import { Entities } from '.';
import { Connection } from '../../db';

export async function deploy(conn: Connection) {
    conn.schema.hasTable('entity').then(function(exists) {
        if (!exists) {
            conn.schema.createTable("entity", function (table){
                table.increments('id').primary();
                table.string("type", 64);
                table.string("subType", 64);
                table.text("body", 1024 * 1024);
            });
        }
    });
}

export async function add(conn: Connection, entity: Entities) {
}