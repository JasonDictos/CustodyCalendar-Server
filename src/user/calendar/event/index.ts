import { EventType as Type, Row } from './row';

// Visitation with a parent at a location
export type Visitation = Row<Type.Visitation, Row.Visitation>;