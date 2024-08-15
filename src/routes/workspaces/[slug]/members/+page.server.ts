import { redirect, fail } from '@sveltejs/kit';
import { count, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { getPaginationParams } from '$lib/utils';
import { drizzle } from '$lib/server/drizzle';
import * as schema from '$lib/server/schema.sql';

import { inviteUserSchema } from '$lib/validations';

import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url, locals, platform }) => {
  const db = drizzle(platform!.env.ACCOUNTS);

  const form = await superValidate(zod(inviteUserSchema));

  const { page, pageSize } = getPaginationParams(url);

  const members = await db
    .select({
      id: schema.users.id,
      name: schema.identities.name,
      email: schema.identities.email,
      image: schema.identities.image,
      joined: schema.users.createdAt,
    })
    .from(schema.users)
    .innerJoin(
      schema.identities,
      eq(schema.users.identityId, schema.identities.id),
    )
    .where(eq(schema.users.workspaceId, locals.currentWorkspaceId!))
    .offset((page - 1) * pageSize)
    .limit(pageSize)
    .execute();

  const result = await db
    .select({
      count: count(schema.users.id),
    })
    .from(schema.users)
    .innerJoin(
      schema.identities,
      eq(schema.users.identityId, schema.identities.id),
    )
    .where(eq(schema.users.workspaceId, locals.currentWorkspaceId!))
    .execute();

  const totalCount = result[0]?.count;

  const canNextPage = totalCount > pageSize * page;
  const canPrevPage = page > 1;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    form,
    members,
    canNextPage,
    canPrevPage,
    totalPages,
    totalCount,
    currentPage: page,
    currentPageSize: pageSize,
  };
};

export const actions: Actions = {
  default: async ({ request, platform, locals, params }) => {
    const workspaceIdOrSlug = params.slug;

    const form = await superValidate(request, zod(inviteUserSchema));

    if (!form.valid) {
      // Again, return { form } and things will just work.
      return fail(400, { form });
    }

    const db = drizzle(platform!.env.ACCOUNTS);

    const identity = await db.query.identities
      .findFirst({
        where(fields, { eq }) {
          return eq(fields.email, form.data.email);
        },
      })
      .execute();

    if (!identity) {
      return fail(400, { form });
    }

    // Add the identity to the workspace
    await db
      .insert(schema.users)
      .values({
        workspaceId: locals.currentWorkspaceId!,
        identityId: identity.id,
      })
      .execute();

    return redirect(302, `/workspaces/${workspaceIdOrSlug}/members`);
  },
};
