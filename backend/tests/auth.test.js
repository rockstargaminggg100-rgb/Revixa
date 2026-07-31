/**
 * REVIXA BACKEND — AUTHENTICATION & AUTHORIZATION TEST SUITE (JEST + SUPERTEST)
 * backend/tests/auth.test.js
 */

import request from 'supertest';
import app from '../src/server.js';

describe('Phase 2.3 — Authentication & Authorization Test Suite', () => {
  const validEmail = `test_user_${Date.now()}@revixa.io`;
  const validPassword = 'Password123!';
  let accessToken = '';
  let refreshToken = '';

  // 1. POST /auth/register tests
  describe('POST /auth/register', () => {
    it('should reject registration with weak password (missing special char or number) with 422', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test Weak',
          email: 'weak@revixa.io',
          password: 'weakpassword'
        });

      expect(res.status).toBe(422);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Validation failed');
    });

    it('should successfully register a new user and return access & refresh tokens', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Executive Owner',
          email: validEmail,
          password: validPassword,
          role: 'Owner',
          organizationName: 'Acme Luxury Retail'
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(validEmail);
      expect(res.body.data.user.role).toBe('Owner');
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();

      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it('should reject duplicate email registration with 409 Conflict', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Duplicate User',
          email: validEmail,
          password: validPassword
        });

      expect(res.status).toBe(409);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('User with this email already exists');
    });
  });

  // 2. POST /auth/login tests
  describe('POST /auth/login', () => {
    it('should successfully authenticate user and return access & refresh tokens', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: validEmail,
          password: validPassword
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.email).toBe(validEmail);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it('should reject login with wrong password returning 401 Unauthorized', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: validEmail,
          password: 'WrongPassword999!'
        });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Invalid email or password credentials');
    });
  });

  // 3. POST /auth/refresh Session Token Rotation
  describe('POST /auth/refresh', () => {
    it('should issue new access & refresh tokens when valid refresh token is supplied', async () => {
      const res = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();

      // Update tokens for subsequent tests
      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it('should reject invalid or revoked refresh token with 401 Unauthorized', async () => {
      const res = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid_or_revoked_refresh_token' });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
    });
  });

  // 4. GET /auth/me Session Profile Lookup
  describe('GET /auth/me', () => {
    it('should return session profile containing user, organization, and role for authenticated user', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(validEmail);
      expect(res.body.data.organization).toBeDefined();
      expect(res.body.data.role).toBe('Owner');
    });
  });

  // 5. POST /auth/logout Token Invalidation
  describe('POST /auth/logout', () => {
    it('should successfully logout user and invalidate refresh token', async () => {
      const res = await request(app)
        .post('/auth/logout')
        .send({ refreshToken });

      expect(res.status).toBe(200);

      // Attempting to refresh with invalidated token must fail with 401
      const refreshRes = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(refreshRes.status).toBe(401);
    });
  });

  // 6. Role-Based Authorization (RBAC) Matrix
  describe('Role-Based Authorization (RBAC)', () => {
    let viewerToken = '';

    beforeAll(async () => {
      const viewerEmail = `viewer_${Date.now()}@revixa.io`;
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Viewer Analyst',
          email: viewerEmail,
          password: 'Password123!',
          role: 'Viewer'
        });
      viewerToken = res.body.data.accessToken;
    });

    it('should return 403 Forbidden when a Viewer attempts Owner/Manager protected action', async () => {
      const res = await request(app)
        .post('/api/v1/recommendations/rec_101/approve')
        .set('Authorization', `Bearer ${viewerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Insufficient permissions');
    });

    it('should allow Owner or Manager role to approve recommendation', async () => {
      const res = await request(app)
        .post('/api/v1/recommendations/rec_101/approve')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('approved');
    });
  });
});
