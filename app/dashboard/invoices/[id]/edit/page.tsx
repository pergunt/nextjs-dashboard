import { customer, invoice } from 'data';
import { notFound } from 'next/navigation';
import { Breadcrumbs, Invoice } from 'ui';

const Page = async ({ params }: { params: { id: string } }) => {
  const [invoiceRecord, customers] = await Promise.all([
    invoice.findOne(params.id),
    customer.getList(),
  ]);

  if (!invoiceRecord) {
    notFound();
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
      <Invoice.Form invoice={invoiceRecord} customers={customers} />
    </main>
  );
};

export default Page;
