# Learn X LMS Deployment Guide

## Environment Variables Setup

### Required Environment Variables

Copy the `.env.example` file to `.env.local` for local development or configure these variables in your deployment platform:

#### MongoDB Configuration
\`\`\`bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_DB=learnx_lms
\`\`\`

#### Authentication
\`\`\`bash
NEXTAUTH_SECRET=your_generated_secret_key
NEXTAUTH_URL=https://your-domain.com
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
\`\`\`

#### Email Service (Resend)
\`\`\`bash
RESEND_API_KEY=your_resend_api_key
\`\`\`

#### Video Services
\`\`\`bash
# Mux (for adaptive video streaming)
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret
MUX_WEBHOOK_SECRET=your_mux_webhook_secret

# YouTube API (for video uploads)
YOUTUBE_API_KEY=your_youtube_api_key

# Vimeo (alternative video service)
VIMEO_ACCESS_TOKEN=your_vimeo_access_token
\`\`\`

#### Payment Processing (Stripe)
\`\`\`bash
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
\`\`\`

#### File Storage (AWS S3)
\`\`\`bash
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name
AWS_REGION=your_aws_region
\`\`\`

#### AI Integration (OpenAI)
\`\`\`bash
OPENAI_API_KEY=your_openai_api_key
\`\`\`

#### Application Configuration
\`\`\`bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Learn X
\`\`\`

## Deployment Steps

### 1. MongoDB Setup
1. Create a MongoDB Atlas cluster or set up MongoDB instance
2. Create a database user with read/write permissions
3. Get your connection string from MongoDB Atlas
4. Run the database initialization: `scripts/01-mongodb-schema.js`
5. Configure network access and IP whitelist

### 2. Resend Email Setup
1. Sign up for Resend account
2. Verify your domain
3. Get your API key from the dashboard
4. Configure email templates (optional)

### 3. Mux Video Setup
1. Create Mux account
2. Get API credentials from Settings > Access Tokens
3. Configure webhook endpoints for video processing notifications
4. Set up signed URLs for secure video playback (optional)

### 4. YouTube API Setup
1. Create Google Cloud Project
2. Enable YouTube Data API v3
3. Create API credentials
4. Configure OAuth consent screen (if using OAuth)

### 5. AWS S3 Setup
1. Create AWS account and S3 bucket
2. Configure IAM user with S3 permissions
3. Set up CORS policy for file uploads
4. Configure bucket policies for public/private access

### 6. Stripe Payment Setup
1. Create Stripe account
2. Get API keys from Developers > API keys
3. Configure webhook endpoints for payment events
4. Set up products and pricing in Stripe Dashboard

### 7. Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set up custom domain (optional)
4. Configure deployment settings

## Environment Validation

The application includes automatic environment validation. Missing required variables will:
- Show warnings in development
- Throw errors in production
- Disable features that require missing variables

## Feature Flags

Features are automatically enabled/disabled based on available environment variables:
- **MongoDB**: Database operations and data persistence
- **Email**: User notifications and communications
- **Video**: Mux streaming and YouTube uploads
- **Payments**: Stripe integration for course purchases
- **File Storage**: AWS S3 for file uploads and storage
- **AI**: OpenAI integration for content generation

## Security Considerations

1. **Never commit `.env.local` or `.env` files to version control**
2. **Use different API keys for development and production**
3. **Regularly rotate API keys and secrets**
4. **Enable webhook signature verification**
5. **Use HTTPS in production**
6. **Configure CORS policies appropriately**
7. **Set up MongoDB network security and IP whitelisting**
8. **Use MongoDB connection string with authentication**

## Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**
   - Verify connection string format
   - Check network connectivity and IP whitelist
   - Ensure database user has proper permissions
   - Verify SSL/TLS configuration

2. **Video Upload Failures**
   - Check Mux/YouTube API credentials
   - Verify file size limits
   - Ensure proper CORS configuration
   - Check AWS S3 permissions

3. **Email Delivery Issues**
   - Verify Resend API key
   - Check domain verification
   - Review email templates
   - Check rate limits

4. **Payment Processing Errors**
   - Verify Stripe API keys
   - Check webhook configuration
   - Ensure proper error handling
   - Verify webhook signatures

5. **File Upload Issues**
   - Check AWS S3 credentials and permissions
   - Verify bucket CORS configuration
   - Ensure proper file size limits
   - Check network connectivity

### Support

For deployment support, check:
1. Application logs in Vercel dashboard
2. MongoDB Atlas logs and metrics
3. Third-party service status pages
4. Environment variable configuration
5. Network connectivity and firewall settings
