'use server';

import {db} from 'configs'
import {fetchHandler} from 'utils'
import {schemas} from './duck'
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

const ROUTE_PATH = '/dashboard/invoices'

export type State = {
  errors?: {
    customer_id?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export const createOne = async (prevSate: State, formData: FormData) => {
  const entries = Object.fromEntries(formData.entries())
  const validatedFields = schemas.CreateUpdateInvoice.safeParse(entries)

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const {amount, customer_id, status} = validatedFields.data
  const createdAt = new Date().toISOString().split('T')[0];
  const amountInCents = amount * 100;

  try {
    await db
      .insertInto('invoices')
      .values({
        amount: amountInCents,
        createdAt,
        customer_id,
        status
      })
      .execute()
  } catch (e: any) {
    // If a database error occurs, return a more specific error.
    return {
      message: e.message,
    };
  }

  revalidatePath(ROUTE_PATH)
  redirect(ROUTE_PATH)
}

export const updateOne = async (id: string, prevState: State, formData: FormData) => {
  const entries = Object.fromEntries(formData.entries())
  const validatedFields = schemas.CreateUpdateInvoice.safeParse(entries)

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const {amount, customer_id, status} = validatedFields.data
  const amountInCents = amount * 100;

  try {
    await db
      .updateTable('invoices')
      .set({
        amount: amountInCents,
        updatedAt: new Date(),
        customer_id,
        status
      })
      .where('id', '=', id)
      .execute()
  } catch (e: any) {
    // If a database error occurs, return a more specific error.
    return {
      message: e.message,
    };
  }

  revalidatePath(ROUTE_PATH)
  redirect(ROUTE_PATH)
}

export const deleteOne = fetchHandler<[string]>(async (id) => {
  await db
    .deleteFrom('invoices')
    .where('id', '=', id)
    .execute()

  revalidatePath(ROUTE_PATH)
})
