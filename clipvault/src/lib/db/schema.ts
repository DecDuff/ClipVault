import { pgTable, text, timestamp, integer, boolean, decimal, uuid, pgEnum, index, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- ENUMS ---
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'canceled', 'past_due', 'trialing']);
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['monthly', 'yearly']);
export const reportReasonEnum = pgEnum('report_reason', ['copyright', 'inappropriate', 'spam', 'other']);
export const reportStatusEnum = pgEnum('report_status', ['pending', 'reviewed', 'resolved', 'dismissed']);
export const strikeTypeEnum = pgEnum('strike_type', ['copyright', 'inappropriate', 'spam', 'severe']);
export const userRoleEnum = pgEnum('user_role', ['user', 'creator', 'admin', 'moderator']);
export const banTypeEnum = pgEnum('ban_type', ['none', 'upload_ban', 'soft_ban', 'hard_ban']);

// --- USERS TABLE ---
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  bio: text('bio'),
  profileImage: text('profile_image'),
  role: userRoleEnum('role').default('user').notNull(),
  isCreator: boolean('is_creator').default(false).notNull(),
  hasActiveSubscription: boolean('has_active_subscription').default(false).notNull(),
  banType: banTypeEnum('ban_type').default('none').notNull(),
  banReason: text('ban_reason'),
  bannedAt: timestamp('banned_at'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeConnectId: text('stripe_connect_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('email_idx').on(table.email),
  usernameIdx: uniqueIndex('username_idx').on(table.username),
}));

// --- SUBSCRIPTIONS TABLE ---
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripePriceId: text('stripe_price_id').notNull(),
  plan: subscriptionPlanEnum('plan').notNull(),
  status: subscriptionStatusEnum('status').notNull(),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('subscription_user_id_idx').on(table.userId),
  stripeSubIdIdx: uniqueIndex('stripe_subscription_id_idx').on(table.stripeSubscriptionId),
}));

// --- CLIPS TABLE ---
export const clips = pgTable('clips', {
  id: uuid('id').defaultRandom().primaryKey(),
  creatorId: uuid('creator_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  videoUrl: text('video_url').notNull(), // Raw high-quality file
  watermarkedUrl: text('watermarked_url').notNull(), // Preview file
  thumbnailUrl: text('thumbnail_url').notNull(),
  duration: integer('duration').default(0).notNull(),
  width: integer('width').default(1080).notNull(),
  height: integer('height').default(1920).notNull(),
  fileSize: integer('file_size').default(0).notNull(),
  isVertical: boolean('is_vertical').default(true).notNull(),

  // Tags and categorization
  tags: text('tags').array().notNull().default([]),
  mood: text('mood').array().notNull().default([]),
  style: text('style').array().notNull().default([]),
  scene: text('scene').array().notNull().default([]),
  useCase: text('use_case').array().notNull().default([]),

  // Stats
  downloadCount: integer('download_count').default(0).notNull(),
  favoriteCount: integer('favorite_count').default(0).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  reportCount: integer('report_count').default(0).notNull(),

  // Moderation
  isHidden: boolean('is_hidden').default(false).notNull(),
  isRemoved: boolean('is_removed').default(false).notNull(),
  removalReason: text('removal_reason'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  creatorIdIdx: index('clip_creator_id_idx').on(table.creatorId),
  tagsIdx: index('clip_tags_idx').on(table.tags),
  createdAtIdx: index('clip_created_at_idx').on(table.createdAt),
}));

// --- DOWNLOADS TABLE ---
export const downloads = pgTable('downloads', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  clipId: uuid('clip_id').references(() => clips.id, { onDelete: 'cascade' }).notNull(),
  downloadedAt: timestamp('downloaded_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('download_user_id_idx').on(table.userId),
  clipIdIdx: index('download_clip_id_idx').on(table.clipId),
  uniqueUserClip: uniqueIndex('unique_user_clip_download').on(table.userId, table.clipId),
}));

// --- FAVORITES TABLE ---
export const favorites = pgTable('favorites', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  clipId: uuid('clip_id').references(() => clips.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('favorite_user_id_idx').on(table.userId),
  clipIdIdx: index('favorite_clip_id_idx').on(table.clipId),
  uniqueUserClip: uniqueIndex('unique_user_clip_favorite').on(table.userId, table.clipId),
}));

// --- SETS (COLLECTIONS) ---
export const sets = pgTable('sets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('set_user_id_idx').on(table.userId),
}));

// --- SET ITEMS ---
export const setItems = pgTable('set_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  setId: uuid('set_id').references(() => sets.id, { onDelete: 'cascade' }).notNull(),
  clipId: uuid('clip_id').references(() => clips.id, { onDelete: 'cascade' }).notNull(),
  order: integer('order').notNull(),
  addedAt: timestamp('added_at').defaultNow().notNull(),
}, (table) => ({
  setIdIdx: index('set_item_set_id_idx').on(table.setId),
  uniqueSetClip: uniqueIndex('unique_set_clip').on(table.setId, table.clipId),
}));

// --- REPORTS TABLE ---
export const reports = pgTable('reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  reporterId: uuid('reporter_id').references(() => users.id, { onDelete: 'set null' }),
  clipId: uuid('clip_id').references(() => clips.id, { onDelete: 'cascade' }).notNull(),
  reason: reportReasonEnum('reason').notNull(),
  details: text('details'),
  status: reportStatusEnum('status').default('pending').notNull(),
  reviewedBy: uuid('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
  reviewedAt: timestamp('reviewed_at'),
  reviewNotes: text('review_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  clipIdIdx: index('report_clip_id_idx').on(table.clipId),
  statusIdx: index('report_status_idx').on(table.status),
}));

// --- STRIKES TABLE ---
export const strikes = pgTable('strikes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  clipId: uuid('clip_id').references(() => clips.id, { onDelete: 'set null' }),
  reportId: uuid('report_id').references(() => reports.id, { onDelete: 'set null' }),
  type: strikeTypeEnum('type').notNull(),
  reason: text('reason').notNull(),
  issuedBy: uuid('issued_by').references(() => users.id, { onDelete: 'set null' }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('strike_user_id_idx').on(table.userId),
}));

// --- EARNINGS TABLE ---
export const earnings = pgTable('earnings', {
  id: uuid('id').defaultRandom().primaryKey(),
  creatorId: uuid('creator_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  clipId: uuid('clip_id').references(() => clips.id, { onDelete: 'set null' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  type: text('type').notNull(), 
  description: text('description'),
  isPaid: boolean('is_paid').default(false).notNull(),
  paidAt: timestamp('paid_at'),
  stripePayoutId: text('stripe_payout_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  creatorIdIdx: index('earning_creator_id_idx').on(table.creatorId),
}));

// --- NOTIFICATIONS TABLE ---
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(), 
  title: text('title').notNull(),
  message: text('message').notNull(),
  link: text('link'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('notification_user_id_idx').on(table.userId),
}));

// --- RELATIONS ---
export const usersRelations = relations(users, ({ many }) => ({
  clips: many(clips),
  downloads: many(downloads),
  favorites: many(favorites),
  sets: many(sets),
  subscriptions: many(subscriptions),
  strikes: many(strikes),
  earnings: many(earnings),
  notifications: many(notifications),
}));

export const clipsRelations = relations(clips, ({ one, many }) => ({
  creator: one(users, { fields: [clips.creatorId], references: [users.id] }),
  downloads: many(downloads),
  favorites: many(favorites),
  reports: many(reports),
  setItems: many(setItems),
}));

export const downloadsRelations = relations(downloads, ({ one }) => ({
  user: one(users, { fields: [downloads.userId], references: [users.id] }),
  clip: one(clips, { fields: [downloads.clipId], references: [clips.id] }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  clip: one(clips, { fields: [favorites.clipId], references: [clips.id] }),
}));

export const setsRelations = relations(sets, ({ one, many }) => ({
  user: one(users, { fields: [sets.userId], references: [users.id] }),
  items: many(setItems),
}));

export const setItemsRelations = relations(setItems, ({ one }) => ({
  set: one(sets, { fields: [setItems.setId], references: [sets.id] }),
  clip: one(clips, { fields: [setItems.clipId], references: [clips.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, { fields: [reports.reporterId], references: [users.id] }),
  clip: one(clips, { fields: [reports.clipId], references: [clips.id] }),
  reviewer: one(users, { fields: [reports.reviewedBy], references: [users.id] }),
}));

export const strikesRelations = relations(strikes, ({ one }) => ({
  user: one(users, { fields: [strikes.userId], references: [users.id] }),
  clip: one(clips, { fields: [strikes.clipId], references: [clips.id] }),
  issuer: one(users, { fields: [strikes.issuedBy], references: [users.id] }),
}));

export const earningsRelations = relations(earnings, ({ one }) => ({
  creator: one(users, { fields: [earnings.creatorId], references: [users.id] }),
  clip: one(clips, { fields: [earnings.clipId], references: [clips.id] }),
}));