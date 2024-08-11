CREATE TABLE `identities` (
	`id` text(20) PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`github_id` text,
	`image` text,
	`password_hash` text NOT NULL,
	`provider` text NOT NULL,
	`kind` text NOT NULL,
	`is_email_verified` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text(20) PRIMARY KEY NOT NULL,
	`is_system` integer DEFAULT false,
	`workspace_id` text(20) NOT NULL,
	`identity_id` text(20),
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` text(20) PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `identities_email_unique` ON `identities` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `identities_github_id_unique` ON `identities` (`github_id`);--> statement-breakpoint
CREATE INDEX `workspace_id_idx` ON `users` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `identity_id_idx` ON `users` (`identity_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_identity_id_workspace_id_unique` ON `users` (`identity_id`,`workspace_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `workspaces_slug_unique` ON `workspaces` (`slug`);