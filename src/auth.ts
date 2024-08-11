import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import Credentials from '@auth/sveltekit/providers/credentials';

import { env } from '$env/dynamic/private';

import { drizzle } from '$lib/server/drizzle';
import * as schema from '$lib/server/schema.sql';
import { loginSchema } from '$lib/validations';
import { hashPassword, verifyPassword } from '$lib/utils/password';

export const { handle, signIn, signOut } = SvelteKitAuth(
  async ({ platform }) => {
    const db = drizzle(platform!.env.ACCOUNTS);

    return {
      secret: env.AUTH_SECRET,
      trustHost: true,
      session: { strategy: 'jwt' },
      callbacks: {
        async jwt({ token, user }) {
          token.id = user.id;
          token.kind = user.kind;

          return token;
        },
        async session({ session, token }) {
          session.user.id = token.id as string;
          session.user.kind = token.kind as 'user' | 'support' | 'admin';

          return session;
        },
      },
      providers: [
        GitHub({
          clientId: env.AUTH_GITHUB_ID,
          clientSecret: env.AUTH_GITHUB_SECRET,
          async profile(profile) {
            const _user = await db
              .insert(schema.identities)
              .values({
                githubId: profile.id.toString(),
                email: profile.email ?? `${profile.id}@github.user`,
                name: profile.name || profile.login,
                image: profile.avatar_url,
                passwordHash: await hashPassword(crypto.randomUUID()),
                kind: 'user',
                provider: 'github',
              })
              .onConflictDoUpdate({
                target: schema.identities.githubId,
                set: {
                  email: profile.email ?? `${profile.id}@github.user`,
                  name: profile.name || profile.login,
                  image: profile.avatar_url,
                },
              })
              .returning();

            const user = _user[0];

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              kind: user.kind,
            };
          },
        }),
        Credentials({
          credentials: {
            email: { label: 'Email' },
            password: { label: 'Password', type: 'password' },
          },
          async authorize(creds) {
            const credentials = loginSchema.parse(creds);

            const user = await db.query.identities.findFirst({
              columns: {
                id: true,
                email: true,
                name: true,
                image: true,
                passwordHash: true,
                kind: true,
              },
              where(fields, operators) {
                return operators.eq(fields.email, credentials.email);
              },
            });

            if (
              !user ||
              !(await verifyPassword(user.passwordHash, credentials.password))
            ) {
              throw new Error('Invalid credentials');
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              kind: user.kind,
            };
          },
        }),
      ],
    };
  },
);
