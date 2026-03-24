# ClipVault Setup Guide

Complete step-by-step guide to deploy ClipVault.

## Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Edit .env with your credentials
nano .env

# 4. Setup database
npm run db:push

# 5. Run development server
npm run dev
```

## Detailed Setup

### Step 1: Database Setup (PostgreSQL)

**Option A: Local PostgreSQL**

```bash
# Install PostgreSQL
sudo apt-get install postgresql

# Create database
sudo -u postgres createdb clipvault

# Get connection string
DATABASE_URL=postgresql://postgres:password@localhost:5432/clipvault
```

**Option B: Managed Database (Recommended)**

Use [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Railway](https://railway.app):

1. Create new PostgreSQL database
2. Copy connection string to `.env`

### Step 2: AWS S3 Setup

1. **Create S3 Bucket**
   - Go to AWS Console > S3
   - Create bucket: `clipvault-videos-prod`
   - Enable public access for GET requests only

2. **Create IAM User**
   - Go to IAM > Users > Create User
   - Attach policy: `AmazonS3FullAccess`
   - Generate access keys
   - Copy to `.env`:
     ```
     AWS_ACCESS_KEY_ID=AKIA...
     AWS_SECRET_ACCESS_KEY=...
     ```

3. **Configure CORS**
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

4. **Set Bucket Policy** (for watermarked videos)
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::clipvault-videos-prod/*"
       }
     ]
   }
   ```

### Step 3: Stripe Setup

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Complete registration

2. **Create Products**

   **Monthly Subscription:**
   - Product name: "ClipVault Monthly"
   - Price: $2.99/month
   - Copy Price ID: `price_xxx` → `STRIPE_PRICE_ID_MONTHLY`

   **Yearly Subscription:**
   - Product name: "ClipVault Yearly"
   - Price: $29.99/year
   - Copy Price ID: `price_yyy` → `STRIPE_PRICE_ID_YEARLY`

3. **Get API Keys**
   - Dashboard > Developers > API Keys
   - Copy Secret Key → `STRIPE_SECRET_KEY`
   - Copy Publishable Key → `STRIPE_PUBLISHABLE_KEY`

4. **Setup Webhook**
   - Dashboard > Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy Signing Secret → `STRIPE_WEBHOOK_SECRET`

### Step 4: NextAuth Setup

```bash
# Generate secret
openssl rand -base64 32

# Add to .env
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=http://localhost:3000  # or your production URL
```

### Step 5: FFmpeg Installation

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Vercel/Serverless:**
Add to `package.json`:
```json
{
  "dependencies": {
    "@ffmpeg-installer/ffmpeg": "^1.1.0"
  }
}
```

### Step 6: Database Migration

```bash
# Generate migration files
npm run db:generate

# Apply to database
npm run db:push
```

### Step 7: Create Admin User

Create a migration or use Drizzle Studio:

```bash
npx drizzle-kit studio
```

Then manually insert admin user with role='admin'.

## Deployment

### Vercel (Easiest)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables from `.env`
5. Deploy

**Important Vercel Settings:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Docker (Advanced)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t clipvault .
docker run -p 3000:3000 --env-file .env clipvault
```

### VPS (Manual)

```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Clone repository
git clone <your-repo>
cd clipvault

# 3. Install dependencies
npm install

# 4. Build
npm run build

# 5. Install PM2 for process management
npm install -g pm2

# 6. Start application
pm2 start npm --name "clipvault" -- start

# 7. Setup nginx reverse proxy
sudo nano /etc/nginx/sites-available/clipvault

# Add:
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 8. Enable site
sudo ln -s /etc/nginx/sites-available/clipvault /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 9. Setup SSL with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Testing

### Test Subscription Flow

1. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

2. Test webhook locally with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   stripe trigger checkout.session.completed
   ```

### Test Video Upload

1. Create creator account
2. Upload test video (< 100MB recommended)
3. Check S3 bucket for files:
   - `videos/{userId}/{timestamp}-original.mp4`
   - `videos/{userId}/{timestamp}-watermarked.mp4`
   - `thumbnails/{userId}/{timestamp}.jpg`

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check if database exists
\l

# Check tables
\dt
```

### S3 Upload Failures

- Check IAM permissions
- Verify bucket CORS policy
- Check bucket exists and region matches
- Test with AWS CLI: `aws s3 ls s3://your-bucket`

### Stripe Webhook Not Working

- Check webhook signing secret matches
- Verify endpoint URL is publicly accessible
- Test with Stripe CLI
- Check Stripe Dashboard > Webhooks for errors

### FFmpeg Errors

```bash
# Check FFmpeg installed
ffmpeg -version

# Test video processing
ffmpeg -i input.mp4 -vf "drawtext=text='Test':x=10:y=10" output.mp4
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Check TypeScript
npm run lint
```

## Performance Tips

1. **Enable CDN**: Use CloudFront for S3 bucket
2. **Add Caching**: Implement Redis for feed caching
3. **Optimize Images**: Use WebP format for thumbnails
4. **Database Indexing**: Already included in schema
5. **Rate Limiting**: Add to protect API endpoints

## Monitoring

1. **Stripe Dashboard**: Monitor subscriptions and revenue
2. **S3 Metrics**: Track storage usage and bandwidth
3. **Database Metrics**: Monitor query performance
4. **Error Tracking**: Add Sentry or similar
5. **Logs**: Use Vercel Analytics or CloudWatch

## Maintenance

### Daily Tasks
- Review moderation queue
- Check for failed webhooks

### Weekly Tasks
- Review analytics
- Check storage costs
- Monitor error logs

### Monthly Tasks
- Update dependencies
- Database backup
- Review security alerts

## Support

For issues:
1. Check logs: `pm2 logs` or Vercel dashboard
2. Review environment variables
3. Test individual components
4. Check service status (Stripe, AWS)

## Scaling

When traffic grows:

1. **Database**: Upgrade to larger instance
2. **CDN**: Add CloudFront for global distribution
3. **Caching**: Add Redis for sessions and feeds
4. **Load Balancing**: Deploy multiple instances
5. **Queue System**: Add Bull/BullMQ for video processing

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable SSL/HTTPS
- [ ] Rotate API keys regularly
- [ ] Enable rate limiting
- [ ] Set up monitoring alerts
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Backup database daily
- [ ] Test disaster recovery
- [ ] Review access logs
