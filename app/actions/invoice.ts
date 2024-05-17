'use server';

import {db} from 'configs'
import {fetchHandler} from 'utils'
import {schemas} from './duck'
import {revalidatePath} from "next/cache";

const ROUTE_PATH = '/dashboard/invoices'

export const createOne = fetchHandler<[FormData]>(async (formData) => {
  const entries = Object.fromEntries(formData.entries())
  const {amount, customer_id, status} = schemas.CreateUpdateInvoice.parse(entries)
  const amountInCents = amount * 100;
  const createdAt = new Date().toISOString().split('T')[0];

  await db
    .insertInto('invoices')
    .values({
      amount: amountInCents,
      createdAt,
      customer_id,
      status
    })
    .execute()

  revalidatePath(ROUTE_PATH)
}, ROUTE_PATH)

export const updateOne = fetchHandler<[string, FormData], void>(async (id, formData) => {
  const entries = Object.fromEntries(formData.entries())
  const {amount, customer_id, status} = schemas.CreateUpdateInvoice.parse(entries)
  const amountInCents = amount * 100;

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

  revalidatePath(ROUTE_PATH)
}, ROUTE_PATH)

export const deleteOne = fetchHandler<[string]>(async (id) => {
  await db
    .deleteFrom('invoices')
    .where('id', '=', id)
    .execute()

  revalidatePath(ROUTE_PATH)
})
