import { Row, RowType as Type, RowSubType as SubType } from './row';

// A location, may be associated to one entity
export type Location = Row<Type.Info, SubType.Location, Row.Location>;

// Parent, guardian, has kids
export type Parent = Row<Type.Guardian, SubType.Parent, Row.Guardian>;

// Foster, a virtual parent/guardian has kids who they adopted (may be relative)
export type Foster = Row<Type.Guardian, SubType.Foster, Row.Guardian>;

// Relative, temporary guardian periodically, or regularly
export type Relative = Row<Type.Guardian, SubType.Relative, Row.Guardian>;

// Monitor is a read only view of a subset of events for a subset of dependents
export type Monitor = Row<Type.Guardian, SubType.Monitor, Row.Guardian>;

// Club is some kinda non person entity that has temporary custodial rights during events 
export type Club = Row<Type.Guardian, SubType.Group, Row.Guardian>;

// Further specialized non club based event, same as a temporary guardian
export type Event = Row<Type.Guardian, SubType.Group, Row.Guardian>;