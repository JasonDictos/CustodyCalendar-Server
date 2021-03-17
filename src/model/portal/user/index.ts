import { UserType as Type, User } from './user';
export { UserType as Type, User } from './user';

// Visitation with a parent at a location
export type Builtin = User<Type.Builtin, User.Builtin>;
export type External = User<Type.External, User.External>;

export type Users = Builtin | External;