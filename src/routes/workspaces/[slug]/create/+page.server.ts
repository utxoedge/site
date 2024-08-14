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
    { name: 'cardano', network: 'mainnet' },
    zod(createApiKeySchema),
  );

  return { form };
};

export const actions: Actions = {
  default: async ({ request, params, platform, locals }) => {
    const workspaceIdOrSlug = params.slug;

    console.log(Object.entries(await request.formData()));

    const form = await superValidate(request, zod(createApiKeySchema));

    console.log(form);

    if (!form.valid) {
      // Again, return { form } and things will just work.
      return fail(400, { form });
    }

    const db = drizzle(platform!.env.ACCOUNTS);

    const [apiKey] = await db
      .insert(schema.apiKeys)
      .values({
        name: form.data.keyName,
        chain:
          form.data.name === 'cardano'
            ? { name: 'cardano', network: form.data.network }
            : { name: 'bitcoin', network: form.data.network },
        workspaceId: locals.currentWorkspaceId!,
      })
      .returning();

    const { env, context } = platform!;

    context.waitUntil(
      env.TOKENS.put(
        apiKey.token,
        JSON.stringify({
          id: apiKey.id,
          workspaceId: apiKey.workspaceId,
          chain: apiKey.chain,
        }),
      ),
    );

    return redirect(302, `/workspaces/${workspaceIdOrSlug}`);
  },
};
