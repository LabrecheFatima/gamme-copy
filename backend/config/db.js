const path = require('path');
const knex = require('knex');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const isSqlite = process.env.DB_CLIENT === 'sqlite3';

const config = isSqlite
  ? {
      client: 'sqlite3',
      connection: {
        filename: path.join(__dirname, '..', process.env.DB_FILENAME || 'dev.sqlite3'),
      },
      useNullAsDefault: true,
    }
  : {
      client: 'mysql2',
      connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
      },
      pool: { min: 0, max: 7 },
    };

const db = knex(config);

async function initDb() {
  if (isSqlite) {
    // 1. Table Admins
    const hasAdmins = await db.schema.hasTable('admins');
    if (!hasAdmins) {
      await db.schema.createTable('admins', table => {
        table.increments('id').primary();
        table.string('username').notNullable().unique();
        table.string('password_hash').notNullable();
        table.timestamps(true, true);
      });

      const defaultAdmin = process.env.ADMIN_USERNAME || 'admin';
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const hash = await bcrypt.hash(defaultPassword, 10);
      await db('admins').insert({ username: defaultAdmin, password_hash: hash });
    }

    // 2. Table Categories
    const hasCategories = await db.schema.hasTable('categories');
    if (!hasCategories) {
      await db.schema.createTable('categories', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('slug').notNullable().unique();
        table.string('usage_method').nullable();
        table.timestamps(true, true);
      });
    }

    // 3. Table Products
    const hasProducts = await db.schema.hasTable('products');
    if (!hasProducts) {
      await db.schema.createTable('products', table => {
        table.increments('id').primary();
        table.integer('category_id').references('id').inTable('categories').onDelete('SET NULL');
        table.string('name').notNullable();
        table.string('slug').notNullable().unique();
        table.text('description');
        table.decimal('original_price', 10, 2).notNullable();
        table.decimal('promo_price', 10, 2).nullable();
        table.integer('stock_quantity').notNullable().defaultTo(0);
        table.string('image_url').nullable();
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
      });
    }

    // 4. Table Settings (Toggle Livraison)
    const hasSettings = await db.schema.hasTable('settings');
    if (!hasSettings) {
      await db.schema.createTable('settings', table => {
        table.string('key').primary();
        table.text('value').notNullable();
      });
      // Valeur par défaut : Livraison désactivée
      await db('settings').insert({ key: 'shipping_enabled', value: 'false' });
    }

    // 5. Table Shipping Rates
    const hasShipping = await db.schema.hasTable('shipping_rates');
    if (!hasShipping) {
      await db.schema.createTable('shipping_rates', table => {
        table.increments('id').primary();
        table.string('wilaya_name').notNullable().unique();
        table.decimal('price', 10, 2).notNullable().defaultTo(0);
        table.boolean('is_active').defaultTo(true);
      });
    }

    // 6. Table Orders
    const hasOrders = await db.schema.hasTable('orders');
    if (!hasOrders) {
      await db.schema.createTable('orders', table => {
        table.increments('id').primary();
        table.string('customer_first_name').notNullable();
        table.string('customer_last_name').notNullable();
        table.string('customer_phone').notNullable();
        table.string('wilaya').notNullable();
        table.string('commune').notNullable();
        table.text('delivery_address').notNullable();
        table.string('status').defaultTo('en_attente');
        table.decimal('shipping_cost', 10, 2).defaultTo(0);
        table.decimal('total_amount', 10, 2).notNullable();
        table.text('notes').nullable();
        table.timestamps(true, true);
      });
    } else {
      // Vérification / Ajout rétroactif de la colonne shipping_cost
      const hasShippingCol = await db.schema.hasColumn('orders', 'shipping_cost');
      if (!hasShippingCol) {
        await db.schema.table('orders', table => {
          table.decimal('shipping_cost', 10, 2).defaultTo(0);
        });
      }
    }

    // 7. Table Order Items
    const hasOrderItems = await db.schema.hasTable('order_items');
    if (!hasOrderItems) {
      await db.schema.createTable('order_items', table => {
        table.increments('id').primary();
        table.integer('order_id').references('id').inTable('orders').onDelete('CASCADE');
        table.integer('product_id').references('id').inTable('products').onDelete('SET NULL');
        table.string('product_name').notNullable();
        table.decimal('unit_price', 10, 2).notNullable();
        table.integer('quantity').notNullable();
      });
    }
  }
}

initDb();
module.exports = db;