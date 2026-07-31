/**
 * REVIXA BACKEND — ENVIRONMENT CONFIGURATION
 * backend/src/config/env.js
 * 
 * Strict environment configuration for production and development.
 * In production mode (NODE_ENV=production), enforces mandatory environment variables and throws on missing keys.
 */

import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// Required environment variable validation helper for production
const requireEnv = (key, fallback = null) => {
  const val = process.env[key];
  if (val) return val;

  if (isProduction) {
    throw new Error(`CRITICAL PRODUCTION STARTUP ERROR: Missing required environment variable "${key}".`);
  }

  if (isTest && fallback) return fallback;
  return fallback;
};

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || (isProduction ? 'https://f-seven-orcin.vercel.app' : 'http://localhost:8080,http://127.0.0.1:8080,https://f-seven-orcin.vercel.app'),
  databaseUrl: requireEnv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/revixa_db?schema=public'),
  jwtSecret: requireEnv('JWT_SECRET', 'fallback_jwt_secret_dev_key_32_bytes_long'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  encryptionKey: requireEnv('ENCRYPTION_KEY', '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
  shopify: {
    apiKey: requireEnv('SHOPIFY_API_KEY', process.env.SHOPIFY_CLIENT_ID || (isTest ? 'test_shopify_api_key_123' : null)),
    apiSecret: requireEnv('SHOPIFY_API_SECRET', process.env.SHOPIFY_CLIENT_SECRET || (isTest ? 'test_shopify_api_secret_456' : null)),
    scopes: process.env.SHOPIFY_SCOPES || 'read_orders,read_products,read_inventory,read_customers',
    redirectUri: requireEnv('SHOPIFY_REDIRECT_URI', isTest ? 'http://localhost:5000/auth/shopify/callback' : null),
    apiVersion: '2024-01'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || ''
  }
};
