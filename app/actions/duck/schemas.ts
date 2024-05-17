
import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  customer_id: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

export const CreateUpdateInvoice = FormSchema.omit({ id: true, date: true });
