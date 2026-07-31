/**
 * REVIXA BACKEND — SERVER ENTRYPOINT
 * backend/src/server.js
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import {
  webhookAppUninstalled,
  webhookOrdersCreate,
  webhookOrdersUpdated
} from './controllers/shopifyController.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// Security Headers (Helmet)
app.use(helmet());

// CORS Configuration with Explicit Allowlist
const allowedOrigins = config.frontendUrl.split(',').map(url => url.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS origin policy restriction: ${origin} not allowed.`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Shopify-Hmac-Sha256', 'X-Shopify-Shop-Domain'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/v1', apiRoutes);

// Webhook Routes
app.post('/webhooks/shopify/app/uninstalled', webhookAppUninstalled);
app.post('/webhooks/shopify/orders/create', webhookOrdersCreate);
app.post('/webhooks/shopify/orders/updated', webhookOrdersUpdated);

// Root health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Revixa API Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Express Server
const PORT = config.port;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`⚡ REVIXA BACKEND API SERVER RUNNING ON PORT ${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/health`);
    console.log(`   Auth Endpoint: http://localhost:${PORT}/auth/login`);
    console.log(`   Shopify OAuth: http://localhost:${PORT}/auth/shopify/install`);
    console.log(`==================================================`);
  });
}

export default app;
