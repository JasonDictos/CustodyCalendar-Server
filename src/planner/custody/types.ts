import * as planner from "../types"

export enum Exchange {
	None = "none",
	Dropoff = "dropoff",
	Pickup = "pickup"
}

export interface Stop {
	timeOfDay: string
	exchange: Exchange
}

export interface Start {
	timeOfDay: string
	exchange: Exchange
}

export interface Plan {
	entity: string
	months: string
	weekdays: string
	start: Start
	stop: Stop
	description: string
}

export interface Info {
	entity: string
	exchange: Exchange
}

export type Occurrance = planner.Occurrance<Info>