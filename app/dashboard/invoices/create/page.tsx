import { customer } from 'data';
import {Breadcrumbs, Invoice} from 'ui';

export default async function Page() {
  const customers = await customer.getList();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Invoice.Form customers={customers} />
    </main>
  );
}
