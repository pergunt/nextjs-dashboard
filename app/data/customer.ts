import {db} from "configs";
import { unstable_noStore as noStore } from 'next/cache';

export const count = async () => {
  noStore()

  const [{total}] = await db
    .selectFrom('customers')
    .select(eb => eb.fn.count('customers.id').as('total'))
    .execute()

  return Number(total ?? '0');
}
