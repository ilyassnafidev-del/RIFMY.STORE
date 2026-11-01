// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
import {sql} from 'drizzle-orm';
import {check} from 'drizzle-orm/sqlite-core';
export const inventory=sqliteTable('inventory',{id:text('id').primaryKey(),available:integer('available').notNull()},table=>[check('nonnegative_stock',sql`${table.available} >= 0`)]);
export const records=sqliteTable('records',{id:text('id').primaryKey(),kind:text('kind').notNull(),value:text('value').notNull(),created:integer('created').notNull()});
export const orders=sqliteTable('orders',{id:text('id').primaryKey(),key:text('idempotency_key').notNull().unique(),customer:text('customer').notNull(),items:text('items').notNull(),subtotal:integer('subtotal').notNull(),discount:integer('discount').notNull(),delivery:integer('delivery').notNull(),total:integer('total').notNull(),status:text('status').notNull(),mode:text('mode').notNull(),session:text('session').unique(),created:integer('created').notNull()});
export const events=sqliteTable('events',{id:text('id').primaryKey(),created:integer('created').notNull()});
