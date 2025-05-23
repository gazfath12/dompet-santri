CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"amount" integer NOT NULL,
	"type" text NOT NULL,
	"transaction_date" date NOT NULL,
	"created_at" date DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "transactions_sample" CASCADE;