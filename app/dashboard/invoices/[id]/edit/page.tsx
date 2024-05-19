
import { customer, invoice } from 'data';
import { notFound } from 'next/navigation'
import {Breadcrumbs} from 'ui';
import {Form} from '../../components'

const Page  = async ({ params }: { params: { id: string } }) => {
  const [invoiceRecord, customers] = await Promise.all([
    invoice.findOne(params.id),
    customer.getList(),
  ]);

  if (!invoiceRecord) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${invoiceRecord.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoiceRecord} customers={customers} />
    </main>
  );
}

export default Page
