import knex from 'knex';
import { Type } from '.';

export enum UserType {
    External,
    Builtin,
}

export interface User<Type extends UserType, Body> {
    id: number;
    type: Type;
    body: Body;
}

export namespace User {
    export type External = {
        oauth2stuff: any;   // @@ TODO
    }

    export type Builtin = {
        email: string;
        password: string;
    }
}

export const Table = knex<User<Type, Body>>("user");

