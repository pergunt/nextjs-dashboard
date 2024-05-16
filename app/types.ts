import {Selectable} from 'kysely'
import { DB } from "kysely-codegen";

export type Row = {
  [Key in keyof DB]: Selectable<DB[Key]>;
};
