CREATE TABLE `inventory` (
	`id` text PRIMARY KEY NOT NULL,
	`available` integer NOT NULL,
	CONSTRAINT "nonnegative_stock" CHECK("inventory"."available" >= 0)
);
