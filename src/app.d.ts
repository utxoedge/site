import type { WorkspacesSelect } from '$lib/server/schema.sql';

type ISODateString = string;

declare module '@auth/core/types' {
  interface Session {
    user: User;
    expires: ISODateString;
  }

  interface User {
    id: string;
    email: string;
    kind: 'support' | 'admin' | 'user';
    name?: string | null;
    image?: string | null;
  }
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface Locals {
      currentWorkspace: WorkspacesSelect | undefined;
    }
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env: {
        TOKENS: KVNamespace;
        ACCOUNTS: D1Database;
      };
      context: {
        waitUntil(promise: Promise<unknown>): void;
      };
      caches: CacheStorage & { default: Cache };
    }
  }
}

export {};
