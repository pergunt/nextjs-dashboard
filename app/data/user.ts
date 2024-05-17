import {db} from "configs";
import {fetchHandler} from 'utils'

export const getUser = fetchHandler<[string]>((email) => {
  return db
    .selectFrom('users')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirstOrThrow()
})
