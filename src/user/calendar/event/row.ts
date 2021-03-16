import { DateTime } from 'luxon';

export enum EventType {
    Visitation,     // A custodioal is enjoying some time with one or more dependents,
                    // another is picking them up
    Appointment,    // Some responsible party is taking a dependent to an appointment
                    // presumably this is a one off with the same guardian taking them back
    Activity        // Some responsible party is taking the dependent to an activity,
                    // another is picking them up
}

export interface Visitation {
    pickupEntityId: number;
    dropoffEntityId: number;
    dependentIds: number[];
}

export interface Row<Type extends EventType, Body> {
    id: number;
    type: Type;
    start: DateTime;
    stop: DateTime;
    entityId: number;
    body: Body;
}

export namespace Row {
    export type Visitation = {
        pickupGuardianId: number;
        dropoffGuardianId: number;
    }

    export type Appointment = {
        guardianId: number;
    }
}