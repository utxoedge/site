import {
  sqliteTable,
  text,
  integer,
  index,
  unique,
} from 'drizzle-orm/sqlite-core';

import { createId } from '../../lib/utils/xid';
import { generateToken } from '../../lib/utils/apiKey';
import { relations } from 'drizzle-orm';
import type { Chain } from '$lib/validations';

export const xid = (name: string) => text(name, { length: 20 });

export const primary = (name?: string) =>
  xid(name ?? 'id')
    .primaryKey()
    .$defaultFn(() => createId());

export const createdAt = (name?: string) =>
  integer(name ?? 'created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull();

export const updatedAt = (name?: string) =>
  createdAt(name ?? 'updated_at').$onUpdate(() => new Date());

export const identities = sqliteTable('identities', {
  id: primary(),
  name: text('name'),
  email: text('email').unique().notNull(),
  githubId: text('github_id').unique(),
  image: text('image'),
  passwordHash: text('password_hash').notNull(),
  provider: text('provider').$type<'github' | 'credentials'>().notNull(),
  kind: text('kind').$type<'support' | 'admin' | 'user'>().notNull(),
  isEmailVerified: integer('is_email_verified', { mode: 'boolean' }).default(
    false,
  ),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const workspaces = sqliteTable('workspaces', {
  id: primary(),
  slug: text('slug').unique().notNull(),
  name: text('name'),
  image: text('image'),

  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
export type WorkspacesSelect = typeof workspaces.$inferSelect;

export const users = sqliteTable(
  'users',
  {
    id: primary(),
    isSystem: integer('is_system', { mode: 'boolean' }).default(false),

    workspaceId: xid('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    identityId: xid('identity_id').references(() => identities.id),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    workspaceIdx: index('workspace_id_idx').on(table.workspaceId),
    identityIdx: index('identity_id_idx').on(table.identityId),
    identityWorkspaceIdx: unique().on(table.identityId, table.workspaceId),
  }),
);

export const identitiesRelations = relations(identities, ({ many }) => ({
  workspaces: many(users),
}));

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  identities: many(users),
  apiKeys: many(apiKeys),
}));

export const usersRelations = relations(users, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [users.workspaceId],
    references: [workspaces.id],
  }),
  identity: one(identities, {
    fields: [users.identityId],
    references: [identities.id],
  }),
}));

export const apiKeys = sqliteTable(
  'api_keys',
  {
    id: primary(),

    name: text('name'),

    token: text('token')
      .notNull()
      .unique()
      .$defaultFn(() => generateToken()),

    chain: text('chain', { mode: 'json' }).notNull().$type<Chain>(),

    workspaceId: xid('workspace_id')
      .notNull()
      .references(() => workspaces.id),

    deleted: integer('deleted', { mode: 'boolean' }).default(false),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    workspaceIdx: index('workspace_id_idx_api_keys').on(table.workspaceId),
    deleted: index('deleted_idx_api_keys').on(table.deleted),
  }),
);

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [apiKeys.workspaceId],
    references: [workspaces.id],
  }),
}));
