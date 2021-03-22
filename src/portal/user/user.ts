export enum Type {
	External = "external",
	Builtin = "builtin",
}

export interface Row {
	id: number;
	type: Type;
	name: string;
	body: Record<string, any>;
}

export interface External {
	oauth2: string;
}

export interface Builtin {
	password: string;
}
