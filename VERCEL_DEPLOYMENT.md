# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **OpenAI API Key**: You'll need to add this as an environment variable

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will detect the `vercel.json` configuration

### 2. Configure Environment Variables

In the Vercel project settings, add these environment variables:

- **OPENAI_API_KEY**: Your OpenAI API key (starts with `sk-`)
- **NODE_ENV**: `production`

**To add environment variables:**
1. Go to Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development
3. Make sure to mark `OPENAI_API_KEY` as sensitive

### 3. Configure Build Settings

Vercel should auto-detect the configuration from `vercel.json`, but verify:

- **Framework Preset**: Vite
- **Root Directory**: `.` (root)
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `cd frontend && npm install && cd ../api && npm install`

### 4. Deploy

1. Click "Deploy"
2. Vercel will:
   - Install dependencies for frontend and API
   - Build the frontend React app
   - Set up serverless functions for the backend
   - Deploy everything

### 5. Verify Deployment

After deployment:

1. **Frontend**: Should be accessible at `https://your-project.vercel.app`
2. **API Health Check**: Visit `https://your-project.vercel.app/api/health`
3. **API Endpoint**: `https://your-project.vercel.app/api/verify-label`

## Project Structure for Vercel

```
/
├── frontend/          # React app (built to frontend/dist)
├── backend/           # Backend code (imported by api/)
├── api/               # Vercel serverless functions
│   ├── index.js       # Express app wrapper
│   └── package.json   # API dependencies
├── vercel.json        # Vercel configuration
└── package.json       # Root package.json
```

## How It Works

1. **Frontend**: Built with Vite and served as static files
2. **Backend**: Express app wrapped as a Vercel serverless function
3. **Routing**: 
   - `/api/*` routes → `api/index.js` serverless function
   - All other routes → Frontend React app (handled by Vite)

## Troubleshooting

### API Not Working

- Check that `OPENAI_API_KEY` is set in Vercel environment variables
- Verify the API function logs in Vercel dashboard
- Check that `/api/health` endpoint returns 200

### Build Fails

- Ensure all dependencies are listed in `frontend/package.json` and `api/package.json`
- Check Vercel build logs for specific errors
- Verify Node.js version (should be 18+)

### CORS Issues

- The Express app has CORS enabled for all origins
- If issues persist, check Vercel function logs

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `NODE_ENV` | No | Set to `production` automatically |

## Cost Considerations

- **Vercel**: Free tier includes generous limits
- **OpenAI API**: Pay per request (GPT-4 Vision pricing)
- **Serverless Functions**: 100GB-hours free per month

## Custom Domain

To add a custom domain:

1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## Monitoring

- **Logs**: View in Vercel dashboard under "Functions" tab
- **Analytics**: Available in Vercel dashboard
- **Errors**: Check function logs for API errors

