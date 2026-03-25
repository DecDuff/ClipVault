import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql', // Changed from 'driver'
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Changed from 'connectionString'
  },
});
