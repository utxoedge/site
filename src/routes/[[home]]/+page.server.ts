import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const isLoggedIn = !!(await locals.auth());
  const isHomePath = url.pathname === '/home';

  if (isLoggedIn && !isHomePath) {
    throw redirect(302, '/workspaces');
  }

  return {
    isLoggedIn,
  };
};
