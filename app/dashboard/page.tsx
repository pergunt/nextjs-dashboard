import {Dashboard, fonts} from '@/ui';
import {fetchRevenue, fetchLatestInvoices, fetchCardData} from '@/lib'

const Page = async () => {
  const [
    revenue,
    latestInvoices,
    cardData
  ] = await Promise.all([
    fetchRevenue(),
    fetchLatestInvoices(),
    fetchCardData()
  ]);

  return (
    <main>
      <h1 className={`${fonts.lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
         <Dashboard.Card title="Collected" value={cardData.totalPaidInvoices} type="collected" />
         <Dashboard.Card title="Pending" value={cardData.totalPendingInvoices} type="pending" />
         <Dashboard.Card title="Total Invoices" value={cardData.numberOfInvoices} type="invoices" />
         <Dashboard.Card title="Total Customers" value={cardData.numberOfCustomers} type="customers" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
         <Dashboard.RevenueChart revenue={revenue}  />
         <Dashboard.LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}

export default Page
