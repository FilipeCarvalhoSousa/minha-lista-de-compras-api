CREATE TABLE "shopping_list_item_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"shopping_list_item_id" integer NOT NULL,
	"quantity" numeric(12, 3) NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"discount_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total_price" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "shopping_list_items_list_idx";--> statement-breakpoint
DROP INDEX "shopping_list_items_product_idx";--> statement-breakpoint
ALTER TABLE "shopping_list_item_entries" ADD CONSTRAINT "shopping_list_item_entries_shopping_list_item_id_shopping_list_items_id_fk" FOREIGN KEY ("shopping_list_item_id") REFERENCES "public"."shopping_list_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "shopping_list_item_entries_item_id_idx" ON "shopping_list_item_entries" USING btree ("shopping_list_item_id");--> statement-breakpoint
CREATE INDEX "shopping_list_item_entries_created_at_idx" ON "shopping_list_item_entries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "shopping_list_items_list_id_idx" ON "shopping_list_items" USING btree ("shopping_list_id");--> statement-breakpoint
CREATE INDEX "shopping_list_items_product_id_idx" ON "shopping_list_items" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "shopping_list_items_list_product_unique" ON "shopping_list_items" USING btree ("shopping_list_id","product_id");