# ClipVault - Subscription Video Clip Marketplace

A complete subscription-based platform for short video clips where users pay for unlimited downloads, creators earn per download, with full moderation, search, recommendations, and payment systems.

## Features

### User Features
- **Subscription System**: $2.99/month or $29.99/year for unlimited downloads
- **Discovery Feed**: TikTok-style vertical scroll with trending, new, and personalized clips
- **Advanced Search**: Filter by mood, style, scene, duration, and orientation
- **Clip Sets**: Create collections of clips for your edits
- **Favorites**: Save clips for later
- **Download History**: Track all downloaded clips

### Creator Features
- **Upload System**: Upload clips with rich metadata (tags, moods, styles)
- **Analytics Dashboard**: Track downloads, views, and earnings
- **Earnings**: $0.99 per 5,000 downloads + bonuses at 100K and 1M downloads
- **Stripe Connect**: Automated payouts via Stripe

### Moderation System
- **Reporting**: Users can report inappropriate content
- **Auto-Moderation**: Clips with 10+ reports are auto-hidden
- **Strike System**: 3 strikes = account suspension
- **Admin Dashboard**: Review reports, issue strikes, ban users
- **Content Removal**: Remove violating content with notifications

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: AWS S3 (or S3-compatible)
- **Authentication**: NextAuth.js
- **Payments**: Stripe for subscriptions and payouts
- **Video Processing**: FFmpeg for watermarking

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- AWS S3 bucket (or S3-compatible storage)
- Stripe account
- FFmpeg installed on server

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/clipvault

# NextAuth
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET_NAME=clipvault-videos
AWS_S3_PUBLIC_URL=https://your-bucket.s3.amazonaws.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
WATERMARK_TEXT=ClipVault

# Creator Earnings
EARNINGS_PER_5K_DOWNLOADS=0.99
BONUS_100K_DOWNLOADS=50.00
BONUS_1M_DOWNLOADS=500.00
```

### 3. Database Setup

```bash
# Install dependencies
npm install

# Generate database migrations
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Stripe Setup

1. Create products and prices in Stripe Dashboard
2. Copy price IDs to `.env`
3. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
4. Add webhook secret to `.env`
5. Enable events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 5. S3 Bucket Setup

1. Create bucket with public read access for watermarked videos
2. Set CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

3. Create folder structure: `videos/`, `thumbnails/`

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Database Schema

### Core Tables

- **users**: User accounts, subscriptions, creator status, bans
- **subscriptions**: Stripe subscription records
- **clips**: Video metadata, tags, stats, moderation status
- **downloads**: Download history
- **favorites**: Saved clips
- **sets**: User-created clip collections
- **set_items**: Clips in sets
- **reports**: Content reports
- **strikes**: User violations
- **earnings**: Creator payouts
- **notifications**: User notifications

## API Structure

### tRPC Routers

- `auth`: Registration
- `clips`: Browse, search, upload, download, favorite
- `subscriptions`: Checkout, manage subscription
- `moderation`: Submit reports, admin review, strikes
- `sets`: Create, manage clip collections
- `creator`: Dashboard, earnings, analytics

### REST Endpoints

- `POST /api/upload`: Upload video (multipart/form-data)
- `POST /api/webhooks/stripe`: Stripe webhook handler

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

1. Build: `npm run build`
2. Start: `npm start`
3. Ensure FFmpeg is installed on server
4. Set up reverse proxy (nginx/Apache)
5. Configure SSL certificate

## Customization

### Pricing

Edit `.env`:
- `EARNINGS_PER_5K_DOWNLOADS`: Amount per 5K downloads
- `BONUS_100K_DOWNLOADS`: Bonus at 100K downloads
- `BONUS_1M_DOWNLOADS`: Bonus at 1M downloads

### Categories

Edit `src/types/index.ts`:
- `MOODS`: Mood categories
- `STYLES`: Style categories
- `SCENES`: Scene categories
- `USE_CASES`: Use case categories

### Moderation Thresholds

Edit `src/server/routers/moderation.ts`:
- Auto-hide threshold (default: 10 reports)
- Strike to ban threshold (default: 3 strikes)

## File Structure

```
clipvault/
├── src/
│   ├── app/                 # Next.js pages
│   │   ├── api/            # API routes
│   │   ├── (auth)/         # Auth pages (login, register)
│   │   └── (main)/         # Main app pages
│   ├── components/         # React components
│   │   ├── ui/            # UI primitives
│   │   ├── clips/         # Clip-related components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utilities
│   │   ├── db/           # Database schema & client
│   │   ├── trpc/         # tRPC client setup
│   │   ├── auth.ts       # NextAuth config
│   │   ├── stripe.ts     # Stripe helpers
│   │   ├── s3.ts         # S3 upload/download
│   │   ├── video.ts      # FFmpeg processing
│   │   └── utils.ts      # Helpers
│   ├── server/           # tRPC server
│   │   ├── routers/     # API routers
│   │   ├── context.ts   # tRPC context
│   │   └── trpc.ts      # tRPC setup
│   └── types/           # TypeScript types
├── drizzle/             # Database migrations
├── public/              # Static assets
└── package.json
```

## Security Considerations

1. **Content Moderation**: Review flagged content regularly
2. **Rate Limiting**: Add rate limiting to API routes
3. **CORS**: Restrict origins in production
4. **Secrets**: Never commit `.env` files
5. **Input Validation**: All inputs validated with Zod
6. **SQL Injection**: Protected via Drizzle ORM
7. **XSS**: React auto-escapes by default

## Performance Optimization

1. **Video Compression**: Compress videos before upload
2. **CDN**: Use CloudFront or similar for video delivery
3. **Caching**: Add Redis for feed caching
4. **Database Indexing**: Indexes on common queries (included in schema)
5. **Image Optimization**: Use Next.js Image component

## Support & Maintenance

- Monitor Stripe webhooks for failures
- Review moderation queue daily
- Back up database regularly
- Update dependencies monthly
- Monitor S3 storage costs

## License

Proprietary - All rights reserved
