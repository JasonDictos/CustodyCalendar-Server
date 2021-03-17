import * as user from './user';

// Define the portal schema
declare module 'Knex/types/tables' {
    interface Tables {
      users: user.User<user.Type, Body>;
    }
  }