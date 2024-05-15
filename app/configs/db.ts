import { createKysely } from '@vercel/postgres-kysely';
import {Selectable} from 'kysely'
import { DB } from "kysely-codegen";


// You'd create one of these when you start your app.
export const db = createKysely<DB>();

export type Row = {
  [Key in keyof DB]: Selectable<DB[Key]>;
};
