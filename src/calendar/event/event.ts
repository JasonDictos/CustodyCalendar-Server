import { DateTime } from 'luxon';

export enum Type {
	Visitation,     // A custodioal is enjoying some time with one or more dependents,
	// another is picking them up
	Appointment,    // Some responsible party is taking a dependent to an appointment
	// presumably this is a one off with the same guardian taking them back
	Activity        // Some responsible party is taking the dependent to an activity,
	// another is picking them up
}

export interface Row {
	id: number;
	type: Type;
	start: DateTime;
	stop: DateTime;
	entityId: number;
	body: Record<string, any>;
}

export interface Visitation {
	pickupEntityId: number;
	dropoffEntityId: number;
	dependentIds: number[];
}

export type Appointment = {
	guardianId: number;
}