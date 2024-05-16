import { createKysely } from '@vercel/postgres-kysely';
import { DB } from "kysely-codegen";


// You'd create one of these when you start your app.
export const db = createKysely<DB>();

