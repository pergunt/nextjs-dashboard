import {Invoices} from 'ui';
import { customer } from 'data';

export default async function Page() {
  const customers = await customer.getList();

  return (
    <main>
      <Invoices.Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Invoices.CreateForm customers={customers} />
    </main>
  );
}
