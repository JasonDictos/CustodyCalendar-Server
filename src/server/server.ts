/* eslint-disable @typescript-eslint/no-unused-vars */
import Express from "express"
import Knex from "knex"
import * as portal from "../portal"
import * as config from "./config"
import * as schema from "../portal/schema"
import * as user from "../portal/user"

// Initiate our schema, one table currently users
const Portal = await schema.connect(Knex(portal.config.Knex))

const Server = Express()

Server.get("/", (req, res) => {
	res.send("Hello from CustodyCalendar")
});

(async function() {
	Server.listen(config.Server.port, () => { console.info("Listening on port", config.Server.port) })
	setInterval(function() { }, Number.MAX_SAFE_INTEGER)
})()
