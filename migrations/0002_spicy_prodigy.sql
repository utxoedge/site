ALTER TABLE `api_keys` ADD `token` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `api_keys_token_unique` ON `api_keys` (`token`);