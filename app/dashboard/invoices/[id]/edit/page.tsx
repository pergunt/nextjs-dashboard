import {Invoices} from 'ui';
import { customer, invoice } from 'data';

const Page  = async ({ params }: { params: { id: string } }) => {
  const [invoiceRecord, customers] = await Promise.all([
    invoice.findOne(params.id),
    customer.getList(),
  ]);

  return (
    <main>
      <Invoices.Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${invoiceRecord.id}/edit`,
            active: true,
          },
        ]}
      />
      <Invoices.EditForm invoice={invoiceRecord} customers={customers} />
    </main>
  );
}

export default Page
