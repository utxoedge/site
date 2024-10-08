import { redirect, type Handle, error } from '@sveltejs/kit';
import { handle as authenticationHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';

import { drizzle } from '$lib/server/drizzle';

const protectedPaths = ['/workspaces', '/profile'];

const authorizationHandle: Handle = async ({ event, resolve }) => {
  if (protectedPaths.some((path) => event.url.pathname.startsWith(path))) {
    const session = await event.locals.auth();

    if (!session) {
      throw redirect(
        303,
        '/auth/signin?callbackUrl=' + encodeURIComponent(event.url.pathname),
      );
    }

    if (event.url.pathname.startsWith('/workspaces')) {
      const parts = event.url.pathname.split('/');
      const workspaceIdOrSlug = parts[2];

      if (workspaceIdOrSlug) {
        const db = drizzle(event.platform!.env.ACCOUNTS);

        const workspace = await db.query.workspaces.findFirst({
          where(fields, operators) {
            return operators.or(
              operators.eq(fields.id, workspaceIdOrSlug),
              operators.eq(fields.slug, workspaceIdOrSlug),
            );
          },
        });

        if (!workspace) {
          throw error(404, 'Not found');
        }

        const isMember = await db.query.users
          .findFirst({
            columns: { id: true },
            where(fields, operators) {
              return operators.and(
                operators.eq(fields.identityId, session.user.identityId),
                operators.eq(fields.workspaceId, workspace.id),
              );
            },
          })
          .execute();

        if (!isMember) {
          event.locals.currentWorkspaceId = undefined;

          throw error(404, 'Not found');
        }

        event.locals.currentWorkspaceId = workspace.id;
      } else {
        event.locals.currentWorkspaceId = undefined;
      }
    } else {
      event.locals.currentWorkspaceId = undefined;
    }
  } else {
    event.locals.currentWorkspaceId = undefined;
  }

  return resolve(event);
};

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(
  authenticationHandle,
  authorizationHandle,
);
