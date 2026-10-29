ALTER TABLE `attendance` ADD `sheet_synced_at` text;--> statement-breakpoint
ALTER TABLE `attendance` ADD `sheet_sync_error` text;--> statement-breakpoint
ALTER TABLE `attendance` ADD `sheet_previous_member_id` integer;