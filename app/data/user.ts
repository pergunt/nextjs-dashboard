import {db} from "configs";
import {fetchHandler} from 'lib'
import {Row} from 'types'

export const getUser = fetchHandler<Row['users'], string>((email) => {
  return db
    .selectFrom('users')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirstOrThrow()
})
