CREATE TABLE `core_registration_flow` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(50) NOT NULL,
	`order` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `core_registration_flow_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `core_websitesettings` ADD `cta_title` varchar(200) DEFAULT 'Siap Bergabung?' NOT NULL;--> statement-breakpoint
ALTER TABLE `core_websitesettings` ADD `cta_description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `core_websitesettings` ADD `cta_primary_text` varchar(100) DEFAULT 'Daftar Sekarang' NOT NULL;--> statement-breakpoint
ALTER TABLE `core_websitesettings` ADD `cta_primary_link` varchar(200) DEFAULT '/pendaftaran' NOT NULL;--> statement-breakpoint
ALTER TABLE `core_websitesettings` ADD `cta_secondary_text` varchar(100) DEFAULT 'Hubungi Kami' NOT NULL;--> statement-breakpoint
ALTER TABLE `core_websitesettings` ADD `cta_secondary_link` varchar(200) DEFAULT '/kontak' NOT NULL;