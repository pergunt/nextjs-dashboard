'use server';

import {db} from 'configs'
import {operations, schemas} from './duck'

export const createOne = async (formData: FormData) => {
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

  operations.invalidatePath()
}

export const updateOne = async (id: string, formData: FormData) => {
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

  operations.invalidatePath()
}

export const deleteOne = async (id: string) => {
  await db
    .deleteFrom('invoices')
    .where('id', '=', id)
    .execute()

  operations.invalidatePath(false)
}
