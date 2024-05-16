'use server';

import { z } from 'zod';
import {db} from 'configs'
// import {fetchHandler} from 'lib/utils'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


const FormSchema = z.object({
  id: z.string(),
  customer_id: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export const createInvoice = async (formData: FormData) => {
  const entries = Object.fromEntries(formData.entries())
  const {amount, customer_id, status} = CreateInvoice.parse(entries)
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await db
    .insertInto('invoices')
    .values({
      amount: amountInCents,
      date,
      customer_id,
      status
    })
    .execute()

  const routePath = '/dashboard/invoices'

  revalidatePath(routePath)

  redirect(routePath)
}
