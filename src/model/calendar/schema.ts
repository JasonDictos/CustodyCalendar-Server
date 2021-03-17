import * as entity from './entity';
import * as event from './event';

// Define the per user calendar schema
declare module 'Knex/types/tables' {
    interface Tables {
      entities: entity.Entity<entity.Type, entity.SubType, Body>;
      events: event.Event<event.Type, Body>;
    }
  }