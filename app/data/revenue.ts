import {db} from "configs";
import {fetchHandler} from "lib";
import { unstable_noStore as noStore } from 'next/cache';

export const getList = fetchHandler( async () => {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore()
  console.log('Fetching revenue data...');
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log('Data fetch completed after 3 seconds.');

  return db
    .selectFrom('revenue')
    .selectAll()
    .execute()
})
