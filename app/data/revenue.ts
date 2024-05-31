import { db } from 'configs';
import { fetchHandler } from 'utils';

export const getList = fetchHandler(async () => {
  console.log('Fetching revenue data...');
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log('Data fetch completed after 3 seconds.');

  return db.selectFrom('revenue').selectAll().execute();
});
