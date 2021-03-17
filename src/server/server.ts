import express from "express";
import * as model from "../model";

const PortalDb = new model.db.PostgreSQL("postgres://root:password@localhost:5432/portal");
const CalendarDbs = new Map<number, model.db.SQLite>();

const Server = express();

Server.get("/", (req, res) => {
    res.send("Hello from CustodyCalendar");
});

(async function() {
    await PortalDb.connect();
})();
