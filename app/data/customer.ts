import {db} from "configs";
import { unstable_noStore as noStore } from 'next/cache';
import { formatCurrency, fetchHandler} from 'utils'
import {Row} from 'types'

export const count = async () => {
  noStore()

  const [{total}] = await db
    .selectFrom('customers')
    .select(eb => eb.fn.count('customers.id').as('total'))
    .execute()

  return Number(total ?? '0');
}

export const getList = fetchHandler(async () => {
  return db
    .selectFrom('customers')
    .selectAll()
    .orderBy('name', 'asc')
    .execute()
})

interface FilteredResult extends Pick<Row['customers'], 'id' | 'name' | 'email' | 'image_url'> {
  total_pending: string;
  total_paid: string;
}

export const listFiltered = fetchHandler<[string], FilteredResult[]>(async (query) => {
    const data = await db
      .selectFrom('customers as C')
      .leftJoin('invoices as I', 'I.customer_id', 'C.id')
      .select(eb => [
        'C.id',
        'C.name',
        'C.email',
        'C.image_url',
        eb.fn.count('I.id').as('total_invoices'),
        eb.fn.sum(
          eb.case()
            .when('I.status', '=', 'pending')
            .then(eb.ref('I.amount'))
            .else(0)
            .end()
        ).as('total_pending'),
        eb.fn.sum(
          eb.case()
            .when('I.status', '=', 'paid')
            .then(eb.ref('I.amount'))
            .else(0)
            .end()
        ).as('total_paid'),
      ])
      .where(eb => eb.or([
        eb('C.name', 'ilike',`%${query}%` ),
        eb('C.email', 'ilike',`%${query}%` ),
      ]))
      .groupBy([
        'C.id',
        'C.name',
        'C.email',
        'C.image_url'
      ])
      .execute()


    return data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(Number(customer.total_pending)),
      total_paid: formatCurrency(Number(customer.total_paid)),
    }));
})
