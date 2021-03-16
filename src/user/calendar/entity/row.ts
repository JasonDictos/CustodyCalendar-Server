// Defines the body concretely for the entity row
export enum RowType {
	Guardian = "guardian",
	Dependent = "dependent",
	Info = "info",
}

// The sub type further defines some logical definition to the
// convrete body type above
export enum RowSubType {
	Location = "location",
	Parent = "parent",  
	Relative = "relative",
	Foster = "foster",
	Child = "child",
	Group = "group",
	Monitor = "monitor",
}

// Row wrapper to generalize how we encode entities in the eneity table
export interface Row<Type extends RowType, SubType extends RowSubType, Body> {
	id: number;
	type: Type;
	subType: SubType;
	body: Body;
}

export namespace Row {
	type PhoneNumber = {
		name: string,				// general purpose, may be type, or named
		number: string;				// fully qualified phone number 
	}

	export type Location = {
		address: string;			// fully qualified address (country etc. warranted)
		lonLat?: [number, number];	// perhaps a fun geo location tag for us to thumbnail
	}

	export type Monitor = {
		name: string;               // full name (may be skipped if defaults fetched from customerId)
		email: string;              // full name (may be skipped if defaults fetched from customerId)
	}

	export type Guardian = {
		customerId?: string;        // link back to front end portal record of payee or logged in customer info
		name: string;               // full name (may be skipped if defaults fetched from customerId)
		email: string;              // full name (may be skipped if defaults fetched from customerId)
		number: PhoneNumber[];      // various ways to get in touch with this person
		location: Location[];		// we expect all guardians to have one (or more) locations available as thats kinda required
		dependentIds: number[];		// row ids for dependents (want them separate to be able to store it once
									// and reference it as needed)
	}

	export type Dependent = {
		birthday: string;
		name: string;
		email?: string;
		number?: PhoneNumber[];
	}
}
