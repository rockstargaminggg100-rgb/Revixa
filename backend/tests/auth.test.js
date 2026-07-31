/**
 * REVIXA BACKEND — AUTHENTICATION & AUTHORIZATION SUITE (JEST + SUPERTEST)
 * backend/tests/auth.test.js
 */

import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/server.js';
import { config } from '../src/config/env.js';

describe('Phase 2.3 — Authentication & Authorization Test Suite', () => {
  const testUser = {
    name: 'Audit Test User',
    email: `audit_${Date.now()}@eleganceparis.com`,
    password: 'SecurePassword123!'
  };

  let authToken = '';
  let userId = '';

  // 1. Registration success + Duplicate email rejection (409)
  describe('POST /auth/register', () => {
    it('should successfully register a new user and return JWT token', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
      expect(res.body.data.user.role).toBe('Owner');
      expect(res.body.data.user.passwordHash).toBeUndefined(); // Sanitized profile

      authToken = res.body.data.accessToken;
      userId = res.body.data.user.id;
    });

    it('should reject duplicate email registration with 409 Conflict', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('already exists');
    });
  });

  // 2. Login success + Wrong password rejection (401)
  describe('POST /auth/login', () => {
    it('should successfully authenticate user and return JWT token', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    });

    it('should reject login with wrong password returning 401 Unauthorized', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword999!'
        });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Invalid email or password');
    });
  });

  // 3-5. JWT Middleware validation (Missing, Invalid, Expired)
  describe('JWT Middleware Validation', () => {
    it('should return 401 Unauthorized for missing JWT token', async () => {
      const res = await request(app)
        .get('/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('No authentication token provided');
    });

    it('should return 403 Forbidden for malformed/invalid JWT token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid_malformed_token_123');

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Invalid or expired token');
    });

    it('should return 403 Forbidden for expired JWT token', async () => {
      const expiredToken = jwt.sign(
        { id: userId, email: testUser.email, role: 'Owner' },
        config.jwtSecret,
        { expiresIn: '-1s' } // Expired token
      );

      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Invalid or expired token');
    });
  });

  // 6. Role Middleware enforcement (Wrong role hitting protected route)
  describe('Role-Based Authorization (RBAC)', () => {
    it('should return 403 Forbidden when a Viewer attempts Owner/Manager protected action', async () => {
      const viewerToken = jwt.sign(
        { id: 'usr_viewer_99', email: 'viewer@eleganceparis.com', role: 'Viewer' },
        config.jwtSecret,
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .post('/api/v1/recommendations/rec_881/approve')
        .set('Authorization', `Bearer ${viewerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Permission denied');
    });

    it('should allow Owner or Manager role to approve recommendation', async () => {
      const res = await request(app)
        .post('/api/v1/recommendations/rec_881/approve')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.status).toBe('executed');
    });
  });

  // 7. GET /auth/me returns sanitized profile
  describe('GET /auth/me', () => {
    it('should return the authenticated user profile without sensitive fields', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.email).toBe(testUser.email.toLowerCase());
      expect(res.body.data.role).toBe('Owner');
      expect(res.body.data.passwordHash).toBeUndefined();
    });
  });

  // 8. GET /auth/session state
  describe('GET /auth/session', () => {
    it('should return authenticated: true when valid JWT token is provided', async () => {
      const res = await request(app)
        .get('/auth/session')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.authenticated).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    });

    it('should return authenticated: false when unauthenticated', async () => {
      const res = await request(app)
        .get('/auth/session');

      expect(res.status).toBe(200);
      expect(res.body.data.authenticated).toBe(false);
    });
  });

  // 9. Rate limiting triggers 429 on threshold
  describe('Rate Limiting (429 Too Many Requests)', () => {
    it('should return 429 when authentication rate limit threshold is exceeded', async () => {
      const rateLimitUser = {
        email: `ratelimit_${Date.now()}@eleganceparis.com`,
        password: 'Password123!'
      };

      // Perform 10 requests to reach limit threshold
      for (let i = 0; i < 10; i++) {
        await request(app).post('/auth/login').send(rateLimitUser);
      }

      // The 11th request must trigger 429 Too Many Requests
      const rateLimitedRes = await request(app)
        .post('/auth/login')
        .send(rateLimitUser);

      expect(rateLimitedRes.status).toBe(429);
      expect(rateLimitedRes.body.status).toBe('error');
      expect(rateLimitedRes.body.message).toContain('Too many authentication attempts');
    });
  });
});
