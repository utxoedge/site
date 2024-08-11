import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { createWorkspaceSchema } from '$lib/validations';
import { drizzle } from '$lib/server/drizzle';
import * as schema from '$lib/server/schema.sql';

import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(createWorkspaceSchema));

  return { form };
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

    await db.transaction(async (dbTx) => {
      // Create the workspace
      const [workspace] = await dbTx
        .insert(schema.workspaces)
        .values({ name: form.data.name, slug: form.data.slug })
        .returning({ id: schema.workspaces.id });

      // Add a system user, useful if we ever need to do some automated changes to the workspace
      await dbTx
        .insert(schema.users)
        .values({ workspaceId: workspace.id, isSystem: true })
        .execute();

      // Add the identity to the workspace
      await dbTx
        .insert(schema.users)
        .values({ workspaceId: workspace.id, identityId: session!.user.id! })
        .execute();
    });

    return redirect(302, `/workspaces`);
  },
};
