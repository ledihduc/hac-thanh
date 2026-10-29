CREATE TABLE `__new_attendance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`member_id` integer NOT NULL,
	`name` text NOT NULL,
	`attendance_date` text NOT NULL,
	`checked_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`correction_token` text
);--> statement-breakpoint
INSERT INTO `__new_attendance` (`id`, `member_id`, `name`, `attendance_date`, `checked_at`, `correction_token`)
SELECT `id`, `member_id`, `name`, date(`checked_at`, '+7 hours'), `checked_at`, NULL FROM `attendance`;--> statement-breakpoint
DROP TABLE `attendance`;--> statement-breakpoint
ALTER TABLE `__new_attendance` RENAME TO `attendance`;--> statement-breakpoint
CREATE UNIQUE INDEX `attendance_member_day_unique` ON `attendance` (`member_id`,`attendance_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `attendance_correction_token_unique` ON `attendance` (`correction_token`);
