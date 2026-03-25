import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql', // Modern version uses 'dialect'
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Modern version uses 'url'
  },
});