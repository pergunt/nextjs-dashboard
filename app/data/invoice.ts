import {db} from "configs";
import {formatCurrency, fetchHandler} from "lib";
import { unstable_noStore as noStore } from 'next/cache';
import {Row} from 'types'

export const listLatest = fetchHandler(async () => {
  noStore()

  const data = await db
    .selectFrom('invoices')
    .innerJoin('customers', 'customers.id', 'invoices.customer_id')
    .select([
      'invoices.id',
      'invoices.amount',
      'customers.name',
      'customers.image_url',
      'customers.email',
    ])
    .orderBy('invoices.date', 'desc')
    .limit(5)
    .execute()

  return data.map((invoice) => ({
    ...invoice,
    amount: formatCurrency(invoice.amount),
  }));
})

export const count = async () => {
  noStore()

  const [{total}] = await db
    .selectFrom('invoices')
    .select(eb => eb.fn.count('invoices.id').as('total'))
    .execute()

  return Number(total ?? '0');
}

export const getStatus = async () => {
  noStore()

  const [{paid, pending}] = await db
    .selectFrom('invoices')
    .select(eb => [
      eb.fn.sum(
        eb
          .case()
          .when('status', '=', 'paid')
          .then(eb.ref('amount'))
          .else('0')
          .end()
      )
        .as('paid'),
      eb.fn.sum(
        eb
          .case()
          .when('status', '=', 'pending')
          .then(eb.ref('amount'))
          .else('0')
          .end()
      )
        .as('pending'),
    ])
    .execute()

  return {
    totalPaidInvoices: formatCurrency(parseInt(paid as any) ?? '0'),
    totalPendingInvoices: formatCurrency(parseInt(pending as any) ?? '0')
  }
}


const ITEMS_PER_PAGE = 6;

type Invoice = Row['invoices']
type Customer = Row['customers']

interface FilteredResult extends Omit<Invoice, 'date' | 'customer_id'>, Pick<Customer, 'name' | 'email' | 'image_url'> {
  date: string;
}

export const listFiltered = fetchHandler<FilteredResult[], {query: string; currentPage: number}>(async ({query, currentPage}) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  return db
    .selectFrom('invoices as I')
    .innerJoin('customers as C', 'C.id', 'I.customer_id')
    .where(eb => eb.or([
      eb('C.name', 'ilike', `%${query}%`),
      eb('C.email', 'ilike', `%${query}%`),
      eb(eb.cast('I.amount', 'text'), 'ilike', `%${query}%`),
      eb(eb.cast('I.date', 'text'), 'ilike', `%${query}%`),
      eb('I.status', 'ilike', `%${query}%`),
    ]))
    .select(eb => [
      'I.id',
      'I.amount',
      eb.cast<string>('I.date', 'text').as('date'),
      'I.status',
      'C.name',
      'C.email',
      'C.image_url',
    ])
    .orderBy('I.date', 'desc')
    .limit(ITEMS_PER_PAGE)
    .offset(offset)
    .execute()
})

export const fetchPages = fetchHandler<number, string>(async (query: string)  => {
  const [{count}] = await db
    .selectFrom('invoices as I')
    .innerJoin('customers as C', 'C.id', 'I.customer_id')
    .where(eb => eb.or([
      eb('C.name', 'ilike', `%${query}%`),
      eb('C.email', 'ilike', `%${query}%`),
      eb(eb.cast('I.amount', 'text'), 'ilike', `%${query}%`),
      eb(eb.cast('I.date', 'text'), 'ilike', `%${query}%`),
      eb('I.status', 'ilike', `%${query}%`),
    ]))
    .select((eb) => eb.fn.count('I.id').as('count'))
    .execute()

  return Math.ceil(Number(count) / ITEMS_PER_PAGE);
})

export const findOne = fetchHandler<Invoice, string>(async (id) => {
  const invoice = await db
    .selectFrom('invoices')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirstOrThrow()


    return {
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100
    }
})
