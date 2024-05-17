import { revalidatePath } from 'next/cache';
import {redirect as nextRedirect} from 'next/navigation';

export const invalidatePath = (redirect = true) => {
  const routePath = '/dashboard/invoices'

  revalidatePath(routePath)

  if (redirect) {
    nextRedirect(routePath)
  }
}
