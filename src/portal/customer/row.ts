export enum CustomerType {
    Group,     
    Individual,
}

export interface Row<Type extends CustomerType, Body> {
    id: number;
    type: Type;
    body: Body;
}

export namespace Row {
    export type Customer = {
        email: number;
        oathSomethingOrAnother: string;
    }
}