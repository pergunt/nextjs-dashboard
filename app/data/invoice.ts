import {db} from "configs";
import {formatCurrency, fetchHandler} from "lib";
import { unstable_noStore as noStore } from 'next/cache';

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


