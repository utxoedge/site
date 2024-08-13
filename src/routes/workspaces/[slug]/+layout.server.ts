import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

// Lib
import { drizzle } from '$lib/server/drizzle';
import * as schema from '$lib/server/schema.sql';

// Locals
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals, platform }) => {
  const workspaceIdOrSlug = params.slug;

  console.log(workspaceIdOrSlug);

  const session = await locals.auth();

  const db = drizzle(platform!.env.ACCOUNTS);

  console.log(session);

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
    .where(eq(schema.users.identityId, session!.user.identityId))
    .execute();

  console.log(workspaces);

  const currentWorkspace = workspaces.find(
    (w) => w.id === workspaceIdOrSlug || w.slug === workspaceIdOrSlug,
  );

  console.log(currentWorkspace);

  if (!currentWorkspace) {
    return redirect(302, '/workspaces');
  }

  return { currentWorkspace, workspaces, user: session!.user };
};
