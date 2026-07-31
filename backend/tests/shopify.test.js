/**
 * REVIXA BACKEND — SHOPIFY OAUTH, SYNC ENGINE & WEBHOOKS TEST SUITE (JEST + SUPERTEST)
 * backend/tests/shopify.test.js
 */

import request from 'supertest';
import crypto from 'crypto';
import app from '../src/server.js';
import { config } from '../src/config/env.js';
import { StoreRepository } from '../src/repositories/StoreRepository.js';
import { encryptToken, decryptToken } from '../src/utils/crypto.js';

describe('Phase 2.4 — Shopify OAuth, Sync & Webhook Test Suite', () => {
  const validShop = 'elegance-paris.myshopify.com';
  const apiSecret = config.shopify.apiSecret;

  // 1. Encryption Round-Trip Verification Test
  describe('AES-256-GCM Encryption Round-Trip', () => {
    it('should save an encrypted connection, retrieve it, decrypt it, and assert it matches the original plaintext token', async () => {
      const originalPlaintextToken = 'test_mock_token_998877665544332211aabbcc';
      const orgId = 'org_roundtrip_test';

      const encrypted = encryptToken(originalPlaintextToken);
      expect(encrypted).not.toBe(originalPlaintextToken);
      expect(encrypted).toContain(':'); // Structured format (iv:authTag:ciphertext)

      await StoreRepository.saveConnection(orgId, validShop, encrypted);
      const retrievedConnection = await StoreRepository.getConnection(orgId);

      expect(retrievedConnection).not.toBeNull();
      expect(retrievedConnection.accessToken).toBe(encrypted);

      const decryptedToken = decryptToken(retrievedConnection.accessToken);
      expect(decryptedToken).toBe(originalPlaintextToken);
    });
  });

  // 2. Install Consent Flow & Replay Nonce Consumption Test
  describe('GET /auth/shopify/install', () => {
    it('should reject invalid shop domain format with 400 Bad Request', async () => {
      const res = await request(app)
        .get('/auth/shopify/install?shop=invalid_domain_format');

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Invalid shop domain format');
    });

    it('should generate OAuth state nonce and redirect to Shopify consent URL for valid shop domain', async () => {
      const res = await request(app)
        .get(`/auth/shopify/install?shop=${validShop}`);

      expect(res.status).toBe(302);
      expect(res.headers.location).toContain(`https://${validShop}/admin/oauth/authorize`);
      expect(res.headers.location).toContain('client_id=');
      expect(res.headers.location).toContain('state=');
    });

    it('should consume and invalidate state nonce after first use to prevent replay attacks', async () => {
      const nonceState = 'nonce_replay_test_123';
      await StoreRepository.saveOAuthState(nonceState, 'org_replay', Date.now() + 600000);

      // First consumption: should return entry
      const firstConsume = await StoreRepository.verifyAndConsumeOAuthState(nonceState);
      expect(firstConsume).not.toBeNull();
      expect(firstConsume.orgId).toBe('org_replay');

      // Second consumption (Replay Attack): must return null because state was deleted
      const secondConsume = await StoreRepository.verifyAndConsumeOAuthState(nonceState);
      expect(secondConsume).toBeNull();
    });
  });

  // 3. OAuth Callback testing (State mismatch, Invalid HMAC, Successful Install)
  describe('GET /auth/shopify/callback', () => {
    it('should reject callback with 400 Bad Request if state nonce is mismatched, already consumed, or expired', async () => {
      const res = await request(app)
        .get(`/auth/shopify/callback?shop=${validShop}&state=invalid_or_consumed_state&hmac=fake_hmac`);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('State CSRF mismatch');
    });

    it('should reject callback with 401 Unauthorized if HMAC signature is invalid', async () => {
      const stateNonce = 'valid_state_nonce_456';
      await StoreRepository.saveOAuthState(stateNonce, 'org_test_1', Date.now() + 600000);

      const res = await request(app)
        .get(`/auth/shopify/callback?shop=${validShop}&state=${stateNonce}&hmac=invalid_hmac_signature_789`);

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Invalid Shopify HMAC signature');
    });

    it('should successfully complete OAuth callback, store token ENCRYPTED, and link organization', async () => {
      const stateNonce = 'valid_state_nonce_789';
      const orgId = 'org_test_success';
      await StoreRepository.saveOAuthState(stateNonce, orgId, Date.now() + 600000);

      const params = {
        code: 'valid_oauth_code_123',
        shop: validShop,
        state: stateNonce,
        timestamp: '1600000000'
      };

      const sortedMessage = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');

      const hmac = crypto
        .createHmac('sha256', apiSecret)
        .update(sortedMessage)
        .digest('hex');

      const res = await request(app)
        .get(`/auth/shopify/callback?code=${params.code}&shop=${params.shop}&state=${params.state}&timestamp=${params.timestamp}&hmac=${hmac}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.shop).toBe(validShop);
      expect(res.body.data.status).toBe('connected');

      // Verify token in Repository/DB is ENCRYPTED (NOT plaintext)
      const connection = await StoreRepository.getConnection(orgId);
      expect(connection).not.toBeNull();
      expect(connection.accessToken).toBeDefined();
      expect(connection.accessToken).not.toContain('shpua_'); // Raw token must NOT appear in plaintext
      expect(connection.accessToken).toContain(':'); // Contains iv:authTag:ciphertext structure

      // Verify decryption works
      const decrypted = decryptToken(connection.accessToken);
      expect(decrypted).toContain('shpua_');
    });
  });

  // 4. Telemetry Sync Engine API Endpoints
  describe('GET /api/v1/shopify/sync-status', () => {
    it('should return sync status and progress tasks checklist', async () => {
      const res = await request(app)
        .get('/api/v1/shopify/sync-status');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.tasks).toBeDefined();
    });
  });

  // 5. Shopify Webhook Handlers
  describe('Shopify Webhook Handlers', () => {
    describe('POST /webhooks/shopify/app/uninstalled', () => {
      it('should reject webhook with 401 Unauthorized if HMAC signature is invalid', async () => {
        const res = await request(app)
          .post('/webhooks/shopify/app/uninstalled')
          .set('X-Shopify-Hmac-Sha256', 'invalid_webhook_hmac_signature')
          .set('X-Shopify-Shop-Domain', validShop)
          .send({ shop_domain: validShop });

        expect(res.status).toBe(401);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toContain('Invalid webhook HMAC signature');
      });

      it('should process app/uninstalled webhook, mark connection inactive, and preserve data', async () => {
        const payloadObj = { shop_domain: validShop };
        const rawBody = JSON.stringify(payloadObj);
        const validWebhookHmac = crypto
          .createHmac('sha256', apiSecret)
          .update(rawBody, 'utf8')
          .digest('base64');

        const res = await request(app)
          .post('/webhooks/shopify/app/uninstalled')
          .set('Content-Type', 'application/json')
          .set('X-Shopify-Hmac-Sha256', validWebhookHmac)
          .set('X-Shopify-Shop-Domain', validShop)
          .send(payloadObj);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data.status).toBe('disconnected');

        const connection = await StoreRepository.getConnectionByShop(validShop);
        expect(connection).not.toBeNull();
        expect(connection.status).toBe('disconnected');
        expect(connection.accessToken).toBeNull();
      });
    });

    describe('POST /webhooks/shopify/orders/create', () => {
      it('should process orders/create webhook correctly when HMAC signature is valid', async () => {
        const payloadObj = { order_number: 1088, total_price: '295.00' };
        const rawBody = JSON.stringify(payloadObj);
        const validWebhookHmac = crypto
          .createHmac('sha256', apiSecret)
          .update(rawBody, 'utf8')
          .digest('base64');

        const res = await request(app)
          .post('/webhooks/shopify/orders/create')
          .set('Content-Type', 'application/json')
          .set('X-Shopify-Hmac-Sha256', validWebhookHmac)
          .set('X-Shopify-Shop-Domain', validShop)
          .send(payloadObj);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data.topic).toBe('orders/create');
        expect(res.body.data.processed).toBe(true);
        expect(res.body.data.orderNumber).toBe(1088);
      });
    });
  });
});
