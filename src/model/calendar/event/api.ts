import { Events } from '.';
import { Connection } from '../../db';

export async function deploy(conn: Connection) {
    conn.schema.hasTable('event').then(function(exists) {
        if (!exists) {
            conn.schema.createTable("event", function (table){
                table.increments('id').primary();
                table.string("type", 64);
                table.datetime("start");
                table.datetime("stop");
                table.number("entityId");
                table.text("body", 1024 * 1024);
            });
        }
    });
}

export async function add(conn: Connection, event: Events) {
}