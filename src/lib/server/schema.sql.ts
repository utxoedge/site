import { sqliteTable, text, integer, index, unique } from 'drizzle-orm/sqlite-core';

import { Xid } from '../../lib/utils/xid';
import { relations } from 'drizzle-orm';

export const createId = () => new Xid().toString();

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
	passwordHash: text('password_hash').notNull(),
	kind: text('kind').$type<'support' | 'admin' | 'user'>().notNull(),
	isEmailVerified: integer('is_email_verified', { mode: 'boolean' }).default(false),

	createdAt: createdAt(),
	updatedAt: updatedAt()
});

export const workspaces = sqliteTable('workspaces', {
	id: primary(),
	slug: text('slug').unique().notNull(),
	name: text('name'),

	createdAt: createdAt(),
	updatedAt: updatedAt()
});

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
		updatedAt: updatedAt()
	},
	(table) => ({
		workspaceIdx: index('workspace_id_idx').on(table.workspaceId),
		identityIdx: index('identity_id_idx').on(table.identityId),
		identityWorkspaceIdx: unique().on(table.identityId, table.workspaceId)
	})
);

export const identitiesRelations = relations(identities, ({ many }) => ({
	workspaces: many(users)
}));

export const workspacesRelations = relations(workspaces, ({ many }) => ({
	identities: many(users)
}));

export const usersRelations = relations(users, ({ one }) => ({
	workspace: one(workspaces, {
		fields: [users.workspaceId],
		references: [workspaces.id]
	}),
	identity: one(identities, {
		fields: [users.identityId],
		references: [identities.id]
	})
}));
