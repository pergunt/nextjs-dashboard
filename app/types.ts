import { Selectable } from 'kysely';
import { DB } from 'kysely-codegen';

export type Row = {
  [Key in keyof DB]: Selectable<DB[Key]>;
};

export type Customer = Row['customers'];

export type Invoice = Row['invoices'];

export type User = Row['users'];
