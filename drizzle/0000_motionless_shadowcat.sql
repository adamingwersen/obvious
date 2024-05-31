DO $$ BEGIN
 CREATE TYPE "survey_metadata_types" AS ENUM('NUMBER', 'RANGE', 'TEXT', 'URL', 'EMAIL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "survey_status" AS ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_privilege" AS ENUM('ORIGINATOR', 'RESPONDENT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "answer" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp DEFAULT null,
	"content" text NOT NULL,
	"document_ids" text[],
	"question_id" integer NOT NULL,
	"created_by_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp DEFAULT null,
	"auth_id" uuid NOT NULL,
	"email" varchar(256) NOT NULL,
	"first_name" varchar(256),
	"last_name" varchar(256),
	"privilege" "user_privilege" DEFAULT 'RESPONDENT' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp DEFAULT null,
	"title" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"forwardable" boolean DEFAULT true NOT NULL,
	"created_by_id" integer NOT NULL,
	"survey_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "survey" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp DEFAULT null,
	"created_by_id" integer NOT NULL,
	"title" varchar(256) NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"parent_instance_id" integer,
	"description" varchar(1028),
	"survey_status" "survey_status" DEFAULT 'DRAFT' NOT NULL,
	"due_at" timestamp DEFAULT null,
	CONSTRAINT "survey_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "survey_instance" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp DEFAULT null,
	"survey_id" integer NOT NULL,
	"created_by_id" integer NOT NULL,
	"parent_instance_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "metadata_question" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp DEFAULT null,
	"survey_id" integer NOT NULL,
	"created_by_id" integer NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(1028),
	"metadata_type" "survey_metadata_types" DEFAULT 'TEXT' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "metadata_answer" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp DEFAULT null,
	"survey_id" integer NOT NULL,
	"metadata_question_id" integer NOT NULL,
	"created_by_id" integer NOT NULL,
	"response" varchar NOT NULL,
	"metadata_type" "survey_metadata_types" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "respondent" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp DEFAULT null,
	"auth_id" uuid,
	"first_seen_at" timestamp DEFAULT null,
	"email" varchar(256) NOT NULL,
	"invited_by_id" integer NOT NULL,
	"survey_id" integer NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "respondent_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "email_survey_unq" UNIQUE("survey_id","email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question" ADD CONSTRAINT "question_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question" ADD CONSTRAINT "question_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "survey"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "survey" ADD CONSTRAINT "survey_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "survey_instance" ADD CONSTRAINT "survey_instance_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "survey"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "survey_instance" ADD CONSTRAINT "survey_instance_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "metadata_question" ADD CONSTRAINT "metadata_question_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "survey"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "metadata_question" ADD CONSTRAINT "metadata_question_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "metadata_answer" ADD CONSTRAINT "metadata_answer_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "survey"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "metadata_answer" ADD CONSTRAINT "metadata_answer_metadata_question_id_metadata_question_id_fk" FOREIGN KEY ("metadata_question_id") REFERENCES "metadata_question"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "metadata_answer" ADD CONSTRAINT "metadata_answer_created_by_id_respondent_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "respondent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
