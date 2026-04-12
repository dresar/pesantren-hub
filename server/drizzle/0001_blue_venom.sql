CREATE TABLE IF NOT EXISTS "document_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" varchar(50) NOT NULL,
	"details" text,
	"ip_address" varchar(39),
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document_settings" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"kop_surat_image" text,
	"kop_surat_height" integer DEFAULT 30 NOT NULL,
	"kop_surat_opacity" integer DEFAULT 100 NOT NULL,
	"show_kop_surat" boolean DEFAULT true NOT NULL,
	"margin_top" integer DEFAULT 10 NOT NULL,
	"margin_bottom" integer DEFAULT 10 NOT NULL,
	"margin_left" integer DEFAULT 15 NOT NULL,
	"margin_right" integer DEFAULT 15 NOT NULL,
	"paper_size" varchar(10) DEFAULT 'A4' NOT NULL,
	"orientation" varchar(10) DEFAULT 'portrait' NOT NULL,
	"watermark_text" varchar(100),
	"watermark_opacity" integer DEFAULT 10 NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document_templates" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"type" varchar(50) NOT NULL,
	"content" text NOT NULL,
	"orientation" varchar(10) DEFAULT 'portrait' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publication_articles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text NOT NULL,
	"featured_image" text,
	"author_id" integer NOT NULL,
	"category_id" integer,
	"type" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"approved_by_id" integer,
	"approved_at" timestamp,
	"rejection_reason" text,
	"views_count" integer DEFAULT 0 NOT NULL,
	"volume_id" integer,
	"pdf_file" text,
	"keywords" text,
	"meta_title" varchar(255),
	"meta_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "publication_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publication_categories" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"type" varchar(20) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "publication_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publication_volumes" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"year" integer NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "media_logs" ALTER COLUMN "details" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "media_files" ADD COLUMN "status" varchar(20) DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "media_files" ADD COLUMN "version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "media_files" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "media_logs" ADD COLUMN "status" varchar(20) DEFAULT 'success';--> statement-breakpoint
ALTER TABLE "media_logs" ADD COLUMN "account_id" integer;--> statement-breakpoint
ALTER TABLE "media_logs" ADD COLUMN "file_id" integer;--> statement-breakpoint
ALTER TABLE "media_logs" ADD COLUMN "performed_by" integer;--> statement-breakpoint
ALTER TABLE "users_user" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users_user" ADD COLUMN "verification_status" varchar(20) DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "users_user" ADD COLUMN "rejected_reason" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document_logs" ADD CONSTRAINT "document_logs_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "publication_articles" ADD CONSTRAINT "publication_articles_author_id_users_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "users_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "publication_articles" ADD CONSTRAINT "publication_articles_category_id_publication_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "publication_categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "publication_articles" ADD CONSTRAINT "publication_articles_approved_by_id_users_user_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "users_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "publication_articles" ADD CONSTRAINT "publication_articles_volume_id_publication_volumes_id_fk" FOREIGN KEY ("volume_id") REFERENCES "publication_volumes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
