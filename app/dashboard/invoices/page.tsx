import { Suspense } from 'react';
import {Invoices, Skeletons, Search, fonts} from 'ui';
import {invoice} from 'data'

const Page = async ({
                      searchParams,
                    }: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await invoice.fetchPages(query)

  console.log(totalPages)
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${fonts.lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <Invoices.Buttons.CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<Skeletons.InvoicesTableSkeleton />}>
        <Invoices.Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Invoices.Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

export default Page
