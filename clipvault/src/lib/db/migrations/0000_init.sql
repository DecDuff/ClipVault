-- 1. USERS & AUTH (For Login/Profiles)
CREATE TABLE IF NOT EXISTS "users" (
    "id" text PRIMARY KEY NOT NULL,
    "name" text,
    "email" text NOT NULL,
    "password" text,
    "image" text,
    "role" text DEFAULT 'user' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");

CREATE TABLE IF NOT EXISTS "accounts" (
    "userId" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
    "type" text NOT NULL,
    "provider" text NOT NULL,
    "providerAccountId" text NOT NULL,
    "refresh_token" text,
    "access_token" text,
    "expires_at" integer,
    "token_type" text,
    "scope" text,
    "id_token" text,
    "session_state" text,
    PRIMARY KEY("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "sessions" (
    "sessionToken" text PRIMARY KEY NOT NULL,
    "userId" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
    "expires" timestamp NOT NULL
);

-- 2. CONTENT (For Video Clips)
CREATE TABLE IF NOT EXISTS "clips" (
    "id" text PRIMARY KEY NOT NULL,
    "title" text NOT NULL,
    "description" text,
    "watermarked_url" text NOT NULL,
    "clean_url" text NOT NULL,
    "thumbnail_url" text,
    "creator_id" text NOT NULL REFERENCES "users"("id"),
    "download_count" integer DEFAULT 0 NOT NULL,
    "favorite_count" integer DEFAULT 0 NOT NULL,
    "moods" text[] DEFAULT '{}',
    "style" text[] DEFAULT '{}',
    "scene" text[] DEFAULT '{}',
    "status" text DEFAULT 'pending' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- 3. ECONOMY (For Subscriptions & Earnings)
CREATE TABLE IF NOT EXISTS "subscriptions" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL REFERENCES "users"("id"),
    "stripe_subscription_id" text NOT NULL,
    "stripe_price_id" text NOT NULL,
    "status" text NOT NULL,
    "current_period_end" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "downloads" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL REFERENCES "users"("id"),
    "clip_id" text NOT NULL REFERENCES "clips"("id"),
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "earnings" (
    "id" text PRIMARY KEY NOT NULL,
    "creator_id" text NOT NULL REFERENCES "users"("id"),
    "amount" integer NOT NULL,
    "status" text DEFAULT 'pending' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- 4. SOCIAL & SETS (For Favorites & Collections)
CREATE TABLE IF NOT EXISTS "favorites" (
    "user_id" text NOT NULL REFERENCES "users"("id"),
    "clip_id" text NOT NULL REFERENCES "clips"("id"),
    PRIMARY KEY("user_id", "clip_id")
);

CREATE TABLE IF NOT EXISTS "sets" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL REFERENCES "users"("id"),
    "title" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- 5. SAFETY & MODERATION (For Reporting & Bans)
CREATE TABLE IF NOT EXISTS "reports" (
    "id" text PRIMARY KEY NOT NULL,
    "reporter_id" text NOT NULL REFERENCES "users"("id"),
    "clip_id" text NOT NULL REFERENCES "clips"("id"),
    "reason" text NOT NULL,
    "status" text DEFAULT 'pending' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "strikes" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL REFERENCES "users"("id"),
    "reason" text NOT NULL,
    "severity" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);
