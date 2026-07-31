/**
 * REVIXA BACKEND — ENVIRONMENT CONFIGURATION
 * backend/src/config/env.js
 */

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080,http://127.0.0.1:8080,https://f-seven-orcin.vercel.app',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/revixa_db?schema=public',
  jwtSecret: process.env.JWT_SECRET || 'fallback_jwt_secret_dev_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  encryptionKey: process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  shopify: {
    apiKey: process.env.SHOPIFY_API_KEY || process.env.SHOPIFY_CLIENT_ID || 'mock_shopify_api_key',
    apiSecret: process.env.SHOPIFY_API_SECRET || process.env.SHOPIFY_CLIENT_SECRET || 'mock_shopify_api_secret_key_123',
    scopes: process.env.SHOPIFY_SCOPES || 'read_orders,read_products,read_inventory,read_customers',
    redirectUri: process.env.SHOPIFY_REDIRECT_URI || 'http://localhost:5000/auth/shopify/callback'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || ''
  }
};
