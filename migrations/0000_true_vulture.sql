CREATE TABLE "airbnb_rentals" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"price" integer NOT NULL,
	"bedrooms" integer NOT NULL,
	"bathrooms" numeric(3, 1) NOT NULL,
	"max_guests" integer NOT NULL,
	"square_feet" integer,
	"description" text NOT NULL,
	"amenities" jsonb,
	"images" jsonb,
	"lat" numeric(9, 6),
	"lng" numeric(9, 6),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"neighborhood_id" integer,
	"featured" boolean DEFAULT false NOT NULL,
	"seo_meta_title" text,
	"seo_meta_description" text,
	"seo_keywords" text
);
--> statement-breakpoint
CREATE TABLE "backlink_organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"website" text NOT NULL,
	"category" text NOT NULL,
	"contact_email" text,
	"contact_phone" text,
	"contact_person" text,
	"notes" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"priority" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"property_id" integer,
	"airbnb_rental_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text NOT NULL,
	"property_id" integer,
	"airbnb_rental_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"read" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "neighborhoods" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"image" text,
	"lat" numeric(9, 6),
	"lng" numeric(9, 6),
	"amenities" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"seo_meta_title" text,
	"seo_meta_description" text,
	"seo_keywords" text,
	"history" text,
	"schools" jsonb,
	"shopping" jsonb,
	"dining" jsonb,
	"recreation" jsonb,
	"transportation" jsonb,
	"median_home_price" integer,
	"crime_rate" real,
	"school_rating" real,
	"walk_score" integer,
	"year_established" integer,
	"local_landmarks" jsonb
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"price" integer NOT NULL,
	"bedrooms" integer NOT NULL,
	"bathrooms" numeric(3, 1) NOT NULL,
	"square_feet" integer NOT NULL,
	"description" text NOT NULL,
	"features" jsonb,
	"images" jsonb,
	"status" text DEFAULT 'active' NOT NULL,
	"year_built" integer,
	"parking_spaces" integer,
	"lat" numeric(9, 6),
	"lng" numeric(9, 6),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"neighborhood_id" integer,
	"featured" boolean DEFAULT false NOT NULL,
	"seo_meta_title" text,
	"seo_meta_description" text,
	"seo_keywords" text
);
--> statement-breakpoint
CREATE TABLE "schema_markups" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_url" text NOT NULL,
	"page_type" text NOT NULL,
	"markup_type" text NOT NULL,
	"json_data" jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"last_tested" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seo_backlinks" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_domain" text NOT NULL,
	"source_url" text NOT NULL,
	"target_url" text NOT NULL,
	"anchor_text" text,
	"do_follow" boolean DEFAULT true NOT NULL,
	"domain_authority" integer,
	"page_authority" integer,
	"discovered" timestamp DEFAULT now() NOT NULL,
	"last_checked" timestamp,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seo_keywords" (
	"id" serial PRIMARY KEY NOT NULL,
	"keyword" text NOT NULL,
	"category" text NOT NULL,
	"search_volume" integer DEFAULT 0,
	"difficulty_score" integer DEFAULT 50,
	"priority" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seo_keywords_keyword_unique" UNIQUE("keyword")
);
--> statement-breakpoint
CREATE TABLE "seo_rankings" (
	"id" serial PRIMARY KEY NOT NULL,
	"keyword_id" integer NOT NULL,
	"position" integer NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"url" text NOT NULL,
	"coldwell_position" integer,
	"remax_position" integer,
	"zillow_position" integer,
	"trulia_position" integer
);
--> statement-breakpoint
CREATE TABLE "seo_strategies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"target_keywords" jsonb,
	"description" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"budget" integer,
	"progress" integer DEFAULT 0,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_login" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "airbnb_rentals" ADD CONSTRAINT "airbnb_rentals_neighborhood_id_neighborhoods_id_fk" FOREIGN KEY ("neighborhood_id") REFERENCES "public"."neighborhoods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_airbnb_rental_id_airbnb_rentals_id_fk" FOREIGN KEY ("airbnb_rental_id") REFERENCES "public"."airbnb_rentals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_airbnb_rental_id_airbnb_rentals_id_fk" FOREIGN KEY ("airbnb_rental_id") REFERENCES "public"."airbnb_rentals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_neighborhood_id_neighborhoods_id_fk" FOREIGN KEY ("neighborhood_id") REFERENCES "public"."neighborhoods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seo_rankings" ADD CONSTRAINT "seo_rankings_keyword_id_seo_keywords_id_fk" FOREIGN KEY ("keyword_id") REFERENCES "public"."seo_keywords"("id") ON DELETE no action ON UPDATE no action;