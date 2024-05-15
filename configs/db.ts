import { createKysely } from '@vercel/postgres-kysely';
import {Selectable} from 'kysely'
import { DB } from "kysely-codegen";

const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE } = process.env;

console.log({
  POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE
})


// You'd create one of these when you start your app.
export const db = createKysely<DB>();

export type Row = {
  [Key in keyof DB]: Selectable<DB[Key]>;
};
