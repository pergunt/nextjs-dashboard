import * as invoice from './invoice'
import * as customer from './customer'
import {fetchHandler} from 'lib'

export const fetchCardData = fetchHandler(async () => {
  const [
    numberOfInvoices,
    numberOfCustomers,
    {totalPaidInvoices, totalPendingInvoices}
  ] = await Promise.all([
    invoice.count(),
    customer.count(),
    invoice.getStatus()
  ]);

  return {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices
  };
})
