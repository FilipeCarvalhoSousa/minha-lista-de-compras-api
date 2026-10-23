CREATE TYPE "public"."shopping_list_source" AS ENUM('manual', 'imported');--> statement-breakpoint
CREATE TABLE "establishments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"cnpj" varchar(14),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shopping_list_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"shopping_list_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" numeric(12, 3) DEFAULT '1' NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"discount_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total_price" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shopping_lists" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"source" "shopping_list_source" DEFAULT 'manual' NOT NULL,
	"purchased_at" timestamp with time zone DEFAULT now() NOT NULL,
	"establishment_id" integer,
	"invoice_number" varchar(30),
	"invoice_series" varchar(10),
	"invoice_access_key" varchar(44),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "description" varchar(300) NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "brand" varchar(150);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "barcode" varchar(14);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "unit" varchar(20) DEFAULT 'UN' NOT NULL;--> statement-breakpoint
ALTER TABLE "shopping_list_items" ADD CONSTRAINT "shopping_list_items_shopping_list_id_shopping_lists_id_fk" FOREIGN KEY ("shopping_list_id") REFERENCES "public"."shopping_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_list_items" ADD CONSTRAINT "shopping_list_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_lists" ADD CONSTRAINT "shopping_lists_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "establishments_cnpj_unique" ON "establishments" USING btree ("cnpj");--> statement-breakpoint
CREATE INDEX "shopping_list_items_list_idx" ON "shopping_list_items" USING btree ("shopping_list_id");--> statement-breakpoint
CREATE INDEX "shopping_list_items_product_idx" ON "shopping_list_items" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "shopping_lists_invoice_access_key_unique" ON "shopping_lists" USING btree ("invoice_access_key");--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "name";