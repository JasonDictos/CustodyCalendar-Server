import Express from "express";
import * as model from "../model";

let PortalDb: model.db.Connection;
let CalendarDbs = new Map<number, model.db.Connection>();

const Server = Express();

Server.get("/", (req, res) => {
	res.send("Hello from CustodyCalendar");
});

(async function() {
	PortalDb = await model.portal.schema.provision(new model.db.SQLite({ filename: "D:/portal.db" }));

	// Addd a dummy user
	const customerId = await PortalDb.table('users').insert({
		type: model.portal.user.Type.Builtin,
		body: {
			name: "Jason Dictos",
			hobby: "Messing with Node",
		}
	});

	console.log("Added customer", customerId);

	// Provision a calendar for them
	CalendarDbs.set(customerId[0], await model.calendar.schema.provision(new model.db.SQLite({ filename: `D:/${customerId}-calendar.db`})));

	Server.listen(888, () => { console.log("Listening on port 888"); })
	setInterval(function() {
		console.log("timer that keeps nodejs processing running");
	}, 1000 * 60 * 60);
})();
