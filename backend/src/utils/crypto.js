/**
 * REVIXA BACKEND — AES-256-GCM CRYPTOGRAPHIC UTILITY
 * backend/src/utils/crypto.js
 * 
 * Encrypts and decrypts sensitive tokens (e.g. Shopify access tokens).
 * Format: iv:authTag:ciphertext (all in hex format)
 */

import crypto from 'crypto';
import { config } from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';

function getEncryptionKey() {
  const hexKey = config.encryptionKey;
  if (!hexKey || hexKey.length !== 64) {
    return crypto.createHash('sha256').update(hexKey || 'fallback_key').digest();
  }
  return Buffer.from(hexKey, 'hex');
}

/**
 * Encrypt a plaintext token using AES-256-GCM
 */
export function encryptToken(token) {
  if (!token) return '';
  const iv = crypto.randomBytes(12); // 12-byte IV for GCM
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt an encrypted token string (iv:authTag:ciphertext)
 */
export function decryptToken(encryptedString) {
  if (!encryptedString) return '';
  const parts = encryptedString.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted token format');
  }

  const [ivHex, authTagHex, ciphertextHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const key = getEncryptionKey();

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Safe timing-safe comparison helper
 */
function safeTimingEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verify Shopify HMAC Signature for OAuth & Webhooks
 */
export function verifyShopifyHmac(queryParamsOrBody, secret, isRawBody = false) {
  if (!queryParamsOrBody || !secret) return false;

  if (isRawBody) {
    // For raw body webhooks
    const hmacHeader = queryParamsOrBody.hmacHeader;
    const rawBody = queryParamsOrBody.rawBody || '';
    if (!hmacHeader) return false;

    const computedHmac = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('base64');

    return safeTimingEqual(hmacHeader, computedHmac);
  }

  // For OAuth callback query parameters
  const { hmac, ...params } = queryParamsOrBody;
  if (!hmac) return false;

  const sortedMessage = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const computedHmac = crypto
    .createHmac('sha256', secret)
    .update(sortedMessage)
    .digest('hex');

  return safeTimingEqual(hmac, computedHmac);
}
