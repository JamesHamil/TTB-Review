# Quick Deployment Guide

## Simplified Structure

The project is now configured for easy Vercel deployment:

```
/
├── frontend/         # React app (builds to frontend/dist)
├── backend/          # Backend code (for local development only)
├── api/              # Vercel serverless functions
│   ├── verify-label.js  # Main API endpoint
│   ├── health.js     # Health check
│   └── package.json  # API dependencies
└── vercel.json       # Vercel configuration
```

## Deploy Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects `vercel.json` configuration

### 3. Add Environment Variable

**CRITICAL**: In Vercel project settings, add:

- **Variable**: `OPENAI_API_KEY`
- **Value**: Your OpenAI API key (starts with `sk-`)
- **Environments**: Production, Preview, Development

### 4. Deploy

Click "Deploy" - Vercel will:
- Build the frontend (`npm run build` in frontend/)
- Install API dependencies
- Deploy everything

## API Endpoints

Once deployed:

- **Frontend**: `https://your-project.vercel.app`
- **Health Check**: `https://your-project.vercel.app/api/health`
- **Verify Label**: `https://your-project.vercel.app/api/verify-label` (POST)

## Local Development

Frontend and backend still work separately for local dev:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## How It Works

- **Frontend**: Vite builds static files to `frontend/dist`
- **API**: Serverless functions in `api/` folder
  - Each `.js` file becomes an endpoint
  - `api/verify-label.js` → `/api/verify-label`
  - `api/health.js` → `/api/health`
- **Routing**: Vercel automatically routes `/api/*` to serverless functions, everything else to frontend

## Troubleshooting

### "OPENAI_API_KEY is not configured"
→ Add the environment variable in Vercel settings

### "Function invocation failed"
→ Check Vercel function logs in the dashboard

### Frontend loads but API fails
→ Verify `OPENAI_API_KEY` is set and valid

## Cost Note

- Vercel: Free tier (generous limits)
- OpenAI: Pay per API call (GPT-4 Vision pricing)

