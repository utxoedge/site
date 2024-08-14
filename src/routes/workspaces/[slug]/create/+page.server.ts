import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

// Validations
import { createApiKeySchema } from '$lib/validations';

import { drizzle } from '$lib/server/drizzle';
import * as schema from '$lib/server/schema.sql';

// Locals
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
  const form = await superValidate(
    { chain: { name: 'cardano', network: 'mainnet' } },
    zod(createApiKeySchema),
  );

  return { form };
};

export const actions: Actions = {
  default: async ({ request, params, platform, locals }) => {
    const workspaceIdOrSlug = params.slug;

    const form = await superValidate(request, zod(createApiKeySchema));

    if (!form.valid) {
      // Again, return { form } and things will just work.
      return fail(400, { form });
    }

    const db = drizzle(platform!.env.ACCOUNTS);

    await db
      .insert(schema.apiKeys)
      .values({
        name: form.data.name,
        chain: form.data.chain,
        workspaceId: locals.currentWorkspaceId!,
      })
      .execute();

    return redirect(302, `/workspaces/${workspaceIdOrSlug}`);
  },
};
