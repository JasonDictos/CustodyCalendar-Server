import { CustomerType, Row } from './row';

// Visitation with a parent at a location
export type EndUser = Row<CustomerType.Individual, Row.Customer>;
export type Group = Row<CustomerType.Group, Row.Customer>;