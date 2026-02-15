CREATE TABLE `admissions_exam_results` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`santri_id` bigint NOT NULL,
	`written_test_score` decimal(5,2),
	`interview_test_score` decimal(5,2),
	`quran_test_score` decimal(5,2),
	`total_score` decimal(5,2),
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`decision_date` datetime,
	`is_published` boolean NOT NULL DEFAULT false,
	`notes` text,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `admissions_exam_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `admissions_exam_schedules` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`santri_id` bigint NOT NULL,
	`type` varchar(20) NOT NULL,
	`scheduled_date` datetime NOT NULL,
	`location` varchar(200) NOT NULL,
	`examiner` varchar(200),
	`status` varchar(20) NOT NULL DEFAULT 'scheduled',
	`notes` text,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `admissions_exam_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `admissions_santri` ADD `foto_kk_approved` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `admissions_santri` ADD `penghasilan_ayah` varchar(50);--> statement-breakpoint
ALTER TABLE `admissions_santri` ADD `penghasilan_ibu` varchar(50);--> statement-breakpoint
ALTER TABLE `admissions_exam_results` ADD CONSTRAINT `admissions_exam_results_santri_id_admissions_santri_id_fk` FOREIGN KEY (`santri_id`) REFERENCES `admissions_santri`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `admissions_exam_schedules` ADD CONSTRAINT `admissions_exam_schedules_santri_id_admissions_santri_id_fk` FOREIGN KEY (`santri_id`) REFERENCES `admissions_santri`(`id`) ON DELETE no action ON UPDATE no action;