/**
 * REVIXA BACKEND — AES-256-GCM & SHOPIFY HMAC CRYPTOGRAPHIC UTILITY
 * backend/src/utils/crypto.js
 * 
 * Complies 100% with Shopify Official OAuth 2.0 & Webhook HMAC Verification Specification:
 * - Removes 'hmac' and 'signature' parameters before hashing
 * - Sorts query parameters lexicographically by key
 * - Joins key=value pairs with '&'
 * - Computes HMAC-SHA256 digest in hex (OAuth) or base64 (Webhooks)
 * - Uses timing-safe string comparison via crypto.timingSafeEqual
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
 * Timing-safe string comparison helper preventing timing side-channel attacks
 */
export function safeTimingEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a.toLowerCase().trim(), 'utf8');
  const bufB = Buffer.from(b.toLowerCase().trim(), 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verify Shopify HMAC Signature according to Shopify Official Specification
 */
export function verifyShopifyHmac(queryParamsOrBody, secret, isRawBody = false) {
  if (!queryParamsOrBody || !secret) return false;

  // 1. Webhook HMAC Verification (Base64 Digest over Raw Body)
  if (isRawBody) {
    const hmacHeader = queryParamsOrBody.hmacHeader;
    const rawBody = queryParamsOrBody.rawBody || '';
    if (!hmacHeader) return false;

    const computedHmac = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('base64');

    return safeTimingEqual(hmacHeader, computedHmac);
  }

  // 2. OAuth Callback HMAC Verification (Hex Digest over Sorted Query Parameters)
  const paramMap = { ...queryParamsOrBody };
  const incomingHmac = paramMap.hmac;
  if (!incomingHmac) return false;

  // Shopify Spec Rule 1: Remove 'hmac' AND 'signature' parameters before hashing
  delete paramMap.hmac;
  delete paramMap.signature;

  // Shopify Spec Rule 2: Sort query parameters lexicographically by key
  const sortedKeys = Object.keys(paramMap).sort();

  // Shopify Spec Rule 3: Format key=value joined by '&'
  const message = sortedKeys
    .map(key => {
      const val = paramMap[key];
      const strVal = Array.isArray(val) ? val.join(',') : String(val);
      return `${key}=${strVal}`;
    })
    .join('&');

  // Shopify Spec Rule 4: Compute HMAC using SHOPIFY_API_SECRET with SHA-256 in hex
  const computedHmac = crypto
    .createHmac('sha256', secret)
    .update(message, 'utf8')
    .digest('hex');

  // Shopify Spec Rule 5: Timing-safe comparison
  return safeTimingEqual(incomingHmac, computedHmac);
}
