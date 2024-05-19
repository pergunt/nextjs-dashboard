import { customer } from 'data';
import {Breadcrumbs} from 'ui';
import {Form} from '../components'

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
      <Form customers={customers} />
    </main>
  );
}
