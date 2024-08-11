import { redirect, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { eq } from 'drizzle-orm';

// Lib
import { drizzle } from '$lib/server/drizzle';
import * as schema from '$lib/server/schema.sql';

// Validations
import { createWorkspaceSchema } from '$lib/validations';

// Locals
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ platform, locals }) => {
  const session = await locals.auth();

  const form = await superValidate(zod(createWorkspaceSchema));

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
    .where(eq(schema.users.identityId, session!.user.identityId))
    .execute();

  return { workspaces, form };
};

export const actions: Actions = {
  default: async ({ request, platform, locals }) => {
    const form = await superValidate(request, zod(createWorkspaceSchema));

    if (!form.valid) {
      // Again, return { form } and things will just work.
      return fail(400, { form });
    }

    const db = drizzle(platform!.env.ACCOUNTS);

    const session = await locals.auth();

    console.log('creating stuff');

    // Create the workspace
    const [workspace] = await db
      .insert(schema.workspaces)
      .values({ name: form.data.name, slug: form.data.slug })
      .returning({ id: schema.workspaces.id });

    // Add a system user, useful if we ever need to do some automated changes to the workspace
    await db
      .insert(schema.users)
      .values({ workspaceId: workspace.id, isSystem: true })
      .execute();

    // Add the identity to the workspace
    await db
      .insert(schema.users)
      .values({
        workspaceId: workspace.id,
        identityId: session!.user.identityId,
      })
      .execute();

    console.log('finished');

    return redirect(302, `/workspaces`);
  },
};
