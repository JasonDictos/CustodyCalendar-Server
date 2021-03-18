import { EventType as Type, Event } from './event';
export { EventType as Type, Event } from './event';
export * from './schema';
export * as api from './api';

// Visitation with a parent at a location
export type Visitation = Event<Type.Visitation, Event.Visitation>;

export type Events = Visitation;