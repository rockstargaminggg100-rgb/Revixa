# REVIXA BACKEND — RAILWAY DEPLOYMENT GUIDE

Step-by-step instructions to deploy the Revixa Node.js/Express REST API & PostgreSQL database on Railway.

---

## 🚀 Option 1: Deploy via Railway CLI

1. **Install & Login to Railway CLI**:
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Initialize Project in `backend/`**:
   ```bash
   cd backend
   railway init
   ```

3. **Provision PostgreSQL Database on Railway**:
   ```bash
   railway add --plugin postgresql
   ```

4. **Deploy Backend Service**:
   ```bash
   railway up
   ```

---

## 🌐 Option 2: Deploy via Railway Dashboard (GitHub Integration)

1. **Go to Railway Dashboard**: Visit [railway.app](https://railway.app) and click **New Project**.
2. **Add PostgreSQL Database**: Select **Provision PostgreSQL**.
3. **Deploy from GitHub Repository**:
   - Select **Deploy from GitHub repo**.
   - Set **Root Directory** to `backend`.
   - Railway will automatically detect `Dockerfile` or `railway.json`.

---

## 🔑 Required Environment Variables on Railway

In your Railway Project Service Settings → **Variables**, set the following environment variables:

| Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `PORT` | `${{PORT}}` or `5000` | Dynamic Port assigned by Railway |
| `NODE_ENV` | `production` | Production environment flag |
| `FRONTEND_URL` | `https://f-seven-orcin.vercel.app` | Production Frontend CORS domain |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Railway Postgres Connection String |
| `JWT_SECRET` | *(Random 32-byte hex string)* | Secret for JWT Token signing |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `ENCRYPTION_KEY` | *(32-byte hex string)* | AES-256-GCM token encryption key |
| `SHOPIFY_API_KEY` | *(Your Shopify App API Key)* | Shopify App Client ID |
| `SHOPIFY_API_SECRET` | *(Your Shopify App Secret)* | Shopify App Secret |
| `SHOPIFY_SCOPES` | `read_orders,read_products,read_inventory,read_customers` | Shopify scopes |
| `SHOPIFY_REDIRECT_URI` | `https://<YOUR_RAILWAY_APP>.up.railway.app/auth/shopify/callback` | OAuth Callback URL |

---

## 🔍 Verification Endpoint After Deployment

Once deployed, verify your live Railway backend URL:
- **Health Check**: `https://<YOUR_RAILWAY_APP>.up.railway.app/health`
- **Database Health**: `https://<YOUR_RAILWAY_APP>.up.railway.app/api/v1/health/database`
- **Dashboard API**: `https://<YOUR_RAILWAY_APP>.up.railway.app/api/v1/dashboard`
