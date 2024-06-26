import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import {db} from "./app/configs";

async function getUser(email: string) {
  try {
    return db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst()

  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6)
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null
        }

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);

        if (!user) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        return passwordsMatch ? user : null;
      },
    }),
  ],
});
