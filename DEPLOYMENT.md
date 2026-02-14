# Deployment Guide

## Quick Start

### 1. Prerequisites
- MongoDB Atlas account (free tier)
- Vercel account (free tier)

### 2. MongoDB Setup
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new cluster (M0 Free tier)
3. Create a database user with read/write permissions
4. Whitelist IP: 0.0.0.0/0 (allows all IPs)
5. Get connection string from "Connect" → "Connect your application"
6. Replace `<username>`, `<password>`, and database name in the connection string

Example connection string:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/anonymous-inbox?retryWrites=true&w=majority
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Random string (e.g., `openssl rand -hex 32`)
5. Click "Deploy"

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET

# Redeploy with environment variables
vercel --prod
```

### 4. Post-Deployment
- Visit your deployed URL
- Test signup, login, and message functionality
- Share your public link!

## Environment Variables

### Required Variables

**MONGODB_URI**
- Your MongoDB Atlas connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

**JWT_SECRET**
- Secret key for signing JWT tokens
- Generate with: `openssl rand -hex 32`
- Must be kept secret and never committed to version control

## Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB Atlas IP whitelist
- Verify connection string is correct
- Ensure database user has correct permissions

### "JWT verification failed"
- Check JWT_SECRET is set in environment variables
- Ensure JWT_SECRET is the same across all serverless functions

### "Rate limit exceeded"
- Normal behavior - wait 5 seconds between messages
- Rate limiting is per IP address

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] IP whitelist configured
- [ ] Environment variables added to Vercel
- [ ] JWT_SECRET generated and set
- [ ] First deployment successful
- [ ] Signup flow tested
- [ ] Login flow tested
- [ ] Message sending tested
- [ ] Message viewing tested
- [ ] Message deletion tested

## Performance Tips

- MongoDB Atlas M0 (free tier) supports up to 512MB storage
- Rate limiting prevents spam and abuse
- Consider upgrading MongoDB tier for production use
- Vercel free tier supports 100GB bandwidth/month

## Security Notes

- Never commit `.env` file to version control
- Use strong, random JWT_SECRET
- Keep MongoDB credentials secure
- Enable MongoDB Atlas audit logs for production
- Consider adding HTTPS redirect in production
- Monitor rate limit logs for abuse patterns
