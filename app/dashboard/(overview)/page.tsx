import { Suspense } from 'react';
import { Dashboard, fonts, Skeletons } from 'ui';

export const dynamic = 'force-dynamic';

const Page = async () => {
  return (
    <main>
      <h1 className={`${fonts.lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<Skeletons.CardsSkeleton />}>
          <Dashboard.CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<Skeletons.RevenueChartSkeleton />}>
          <Dashboard.RevenueChart />
        </Suspense>
        <Suspense fallback={<Skeletons.LatestInvoicesSkeleton />}>
          <Dashboard.LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
};

export default Page;
