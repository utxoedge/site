import { redirect, error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const isLoggedIn = !!(await locals.auth());
  const isHomePath = url.pathname === '/home';

  if (isLoggedIn && url.pathname === '/') {
    throw redirect(302, '/workspaces');
  }

  if (!isHomePath && url.pathname !== '/') {
    throw error(404, 'Not found');
  }

  return {
    isLoggedIn,
  };
};
