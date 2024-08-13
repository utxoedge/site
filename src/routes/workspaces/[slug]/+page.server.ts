import { and, count, eq } from 'drizzle-orm';

import { getPaginationParams } from '$lib/utils';
import { drizzle } from '$lib/server/drizzle';
import * as schema from '$lib/server/schema.sql';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, platform }) => {
  const db = drizzle(platform!.env.ACCOUNTS);

  const { page, pageSize } = getPaginationParams(url);

  const apiKeys = await db.query.apiKeys
    .findMany({
      where(fields, { and, eq }) {
        return and(
          eq(fields.workspaceId, locals.currentWorkspaceId!),
          eq(fields.deleted, false),
        );
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
    })
    .execute();

  const result = await db
    .select({
      count: count(schema.apiKeys.id),
    })
    .from(schema.apiKeys)
    .where(
      and(
        eq(schema.apiKeys.workspaceId, locals.currentWorkspaceId!),
        eq(schema.apiKeys.deleted, false),
      ),
    )
    .execute();

  const totalCount = result[0]?.count;

  const canNextPage = totalCount > pageSize * page;
  const canPrevPage = page > 1;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    apiKeys,
    canNextPage,
    canPrevPage,
    totalPages,
    totalCount,
    currentPage: page,
    currentPageSize: pageSize,
  };
};
