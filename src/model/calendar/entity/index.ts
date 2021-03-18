import { Entity, EntityType as Type, EntitySubType as SubType } from './entity';
export { Entity, EntityType as Type, EntitySubType as SubType } from './entity';
export * from './schema';

// A location, may be associated to one entity
export type Location = Entity<Type.Info, SubType.Location, Entity.Location>;

// Parent, guardian, has kids
export type Parent = Entity<Type.Guardian, SubType.Parent, Entity.Guardian>;

// Foster, a virtual parent/guardian has kids who they adopted (may be relative)
export type Foster = Entity<Type.Guardian, SubType.Foster, Entity.Guardian>;

// Relative, temporary guardian periodically, or regularly
export type Relative = Entity<Type.Guardian, SubType.Relative, Entity.Guardian>;

// Monitor is a read only view of a subset of events for a subset of dependents
export type Monitor = Entity<Type.Guardian, SubType.Monitor, Entity.Guardian>;

// Club is some kinda non person entity that has temporary custodial rights during events 
export type Club = Entity<Type.Guardian, SubType.Group, Entity.Guardian>;

// Further specialized non club based event, same as a temporary guardian
export type Event = Entity<Type.Guardian, SubType.Group, Entity.Guardian>;

export type Entities = Event | Club | Monitor | Relative| Foster | Parent | Location;