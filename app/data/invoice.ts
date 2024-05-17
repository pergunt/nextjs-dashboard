import {db} from "configs";
import {formatCurrency, fetchHandler} from 'utils'
import {Row} from 'types'

export const listLatest = fetchHandler(async () => {
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
    .orderBy('invoices.createdAt', 'desc')
    .limit(5)
    .execute()

  return data.map((invoice) => ({
    ...invoice,
    amount: formatCurrency(invoice.amount),
  }));
})

export const count = async () => {
  const [{total}] = await db
    .selectFrom('invoices')
    .select(eb => eb.fn.count('invoices.id').as('total'))
    .execute()

  return Number(total ?? '0');
}

export const getStatus = async () => {
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

interface FilteredResult extends Omit<Invoice, 'createdAt' | 'updatedAt' |  'customer_id'>, Pick<Customer, 'name' | 'email' | 'image_url'> {
  updatedAt: string;
  createdAt: string;
}

export const listFiltered = fetchHandler<[{query: string; currentPage: number}], FilteredResult[]>(async ({query, currentPage}) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  return db
    .selectFrom('invoices as I')
    .innerJoin('customers as C', 'C.id', 'I.customer_id')
    .where(eb => eb.or([
      eb('C.name', 'ilike', `%${query}%`),
      eb('C.email', 'ilike', `%${query}%`),
      eb(eb.cast('I.amount', 'text'), 'ilike', `%${query}%`),
      eb(eb.cast('I.createdAt', 'text'), 'ilike', `%${query}%`),
      eb('I.status', 'ilike', `%${query}%`),
    ]))
    .select(eb => [
      'I.id',
      'I.amount',
      eb.cast<string>('I.createdAt', 'text').as('createdAt'),
      eb.cast<string>('I.updatedAt', 'text').as('updatedAt'),
      'I.status',
      'C.name',
      'C.email',
      'C.image_url',
    ])
    .orderBy(['I.updatedAt asc', 'I.createdAt desc'])
    .limit(ITEMS_PER_PAGE)
    .offset(offset)
    .execute()
})

export const fetchPages = fetchHandler<[string], number>(async (query: string)  => {
  const [{count}] = await db
    .selectFrom('invoices as I')
    .innerJoin('customers as C', 'C.id', 'I.customer_id')
    .where(eb => eb.or([
      eb('C.name', 'ilike', `%${query}%`),
      eb('C.email', 'ilike', `%${query}%`),
      eb(eb.cast('I.amount', 'text'), 'ilike', `%${query}%`),
      eb(eb.cast('I.createdAt', 'text'), 'ilike', `%${query}%`),
      eb('I.status', 'ilike', `%${query}%`),
    ]))
    .select((eb) => eb.fn.count('I.id').as('count'))
    .execute()

  return Math.ceil(Number(count) / ITEMS_PER_PAGE);
})

export const findOne = fetchHandler<[string], Invoice | null>(async (id) => {
  const invoice = await db
    .selectFrom('invoices')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst()

  if (!invoice) {
    return null
  }

    return {
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100
    }
})
