CREATE TABLE `api_keys` (
	`id` text(20) PRIMARY KEY NOT NULL,
	`chain` text NOT NULL,
	`workspace_id` text(20) NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `workspace_id_idx_api_keys` ON `api_keys` (`workspace_id`);