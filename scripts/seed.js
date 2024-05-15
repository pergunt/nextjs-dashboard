import {sql} from 'kysely'
import { createKysely } from '@vercel/postgres-kysely';
import {
  invoices,
  customers,
  revenue,
  users,
} from  '../app/lib/placeholder-data'
import bcrypt from 'bcrypt'

async function seedUsers(db) {
  try {
    await db.schema
      .createTable('users')
      .ifNotExists()
      .addColumn('id',  'uuid', col => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
      .addColumn('name', 'varchar(255)', (col) => col.notNull())
      .addColumn('email', 'text', col => col.notNull().unique())
      .addColumn('password', 'text', col => col.notNull())
      .execute()

    console.log(`Created "users" table`);
    const values = await Promise.all(users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: hashedPassword
      }
    }))

    const insertedUsers = await db
        .insertInto('users')
        .values(values)
        .onConflict(cb => cb.doNothing())
        .execute()


    console.log(`Seeded ${insertedUsers.length} users`);

  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices(db) {
  try {
    await db.schema
      .createTable('invoices')
      .ifNotExists()
      .addColumn('id',  'uuid', col => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
      .addColumn('customer_id', 'uuid', (col) => col.notNull())
      .addColumn('amount', 'integer', col => col.notNull())
      .addColumn('status', 'varchar(255)', col => col.notNull())
      .addColumn('date', 'date', col => col.notNull())
      .addForeignKeyConstraint(
          'invoices_customer_FK',
          ['customer_id'],
          'customers',
          ['id']
      )
      .execute()

    console.log(`Created "invoices" table`);

    const insertedInvoices = await db
      .insertInto('invoices')
      .values(invoices.map( (invoice) => {
        return {
          customer_id: invoice.customer_id,
          amount: invoice.amount,
          status: invoice.status,
          date: invoice.date
        }
      }))
      .onConflict(cb => cb.doNothing())
      .execute()

    console.log(`Seeded ${insertedInvoices.length} invoices`);

  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(db) {
  try {

    await db.schema
      .createTable('customers')
      .ifNotExists()
      .addColumn('id',  'uuid', col => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
      .addColumn('name', 'varchar(255)', (col) => col.notNull())
      .addColumn('email', 'varchar(255)', col => col.notNull())
      .addColumn('image_url', 'varchar(255)', col => col.notNull())
      .execute()

    console.log(`Created "customers" table`);

    const insertedCustomers = await db
      .insertInto('customers')
      .values(customers.map( (customer) => {
        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          image_url: customer.image_url
        }
      }))
      .onConflict(cb => cb.doNothing())
      .execute()

    console.log(`Seeded ${insertedCustomers.length} customers`);

  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(db) {
  try {
    await db.schema
      .createTable('revenue')
      .ifNotExists()
      .addColumn('month', 'varchar(4)', (col) => col.notNull().unique())
      .addColumn('revenue', 'integer', col => col.notNull())
      .execute()

    console.log(`Created "revenue" table`);


    const insertedRevenue = await db
      .insertInto('revenue')
      .values(revenue.map( (rev) => {
        return {
          month: rev.month,
          revenue: rev.revenue,
        }
      }))
      .onConflict(cb => cb.doNothing())
      .execute()

    console.log(`Seeded ${insertedRevenue.length} revenue`);

  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  const db = createKysely()

  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(db)

  await seedUsers(db);
  await seedCustomers(db);
  await seedInvoices(db);
  await seedRevenue(db);

  process.exit()
  // await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
