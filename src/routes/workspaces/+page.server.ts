import { eq } from 'drizzle-orm';

// Lib
import { drizzle } from '$lib/server/drizzle';
import * as schema from '$lib/server/schema.sql';

// Locals
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, locals }) => {
  const session = await locals.auth();

  const db = drizzle(platform!.env.ACCOUNTS);

  const workspaces = await db
    .select({
      id: schema.workspaces.id,
      slug: schema.workspaces.slug,
      name: schema.workspaces.name,
      createdAt: schema.workspaces.createdAt,
      updatedAt: schema.workspaces.updatedAt,
    })
    .from(schema.workspaces)
    .innerJoin(schema.users, eq(schema.workspaces.id, schema.users.workspaceId))
    .where(eq(schema.users.identityId, session!.user.id!))
    .execute();

  return { workspaces };
};
