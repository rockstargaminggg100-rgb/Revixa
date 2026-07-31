/**
 * REVIXA BACKEND — SHOPIFY REPOSITORY
 * backend/src/repositories/ShopifyRepository.js
 * 
 * Only layer allowed to perform Prisma queries for Store / Shopify domain.
 * Supports fallback in-memory store when DB connection is offline.
 */

import prisma from '../database/prisma.js';

// In-memory fallback stores & OAuth state map
const fallbackStores = new Map();
const oauthStates = new Map();

export class ShopifyRepository {
  /**
   * Save or update Shopify store connection
   */
  static async saveConnection(orgId, shopDomain, encryptedToken) {
    if (prisma) {
      try {
        const store = await prisma.store.upsert({
          where: { myshopifyDomain: shopDomain },
          update: {
            accessToken: encryptedToken,
            status: 'connected',
            organizationId: orgId
          },
          create: {
            organizationId: orgId,
            name: shopDomain.replace('.myshopify.com', '').toUpperCase(),
            domain: shopDomain.replace('.myshopify.com', '.com'),
            myshopifyDomain: shopDomain,
            accessToken: encryptedToken,
            status: 'connected'
          }
        });
        if (store) return store;
      } catch (err) {
        console.warn('[ShopifyRepository] saveConnection fallback:', err.message);
      }
    }

    const connection = {
      id: `store_${Date.now()}`,
      organizationId: orgId,
      name: shopDomain.replace('.myshopify.com', '').toUpperCase(),
      domain: shopDomain.replace('.myshopify.com', '.com'),
      myshopifyDomain: shopDomain,
      accessToken: encryptedToken,
      status: 'connected',
      updatedAt: new Date()
    };

    fallbackStores.set(orgId, connection);
    fallbackStores.set(shopDomain, connection);
    return connection;
  }

  /**
   * Get store connection by organizationId
   */
  static async getConnection(orgId) {
    if (prisma) {
      try {
        const store = await prisma.store.findFirst({
          where: { organizationId: orgId }
        });
        if (store) return store;
      } catch (err) {
        console.warn('[ShopifyRepository] getConnection fallback:', err.message);
      }
    }
    return fallbackStores.get(orgId) || null;
  }

  /**
   * Get store connection by shop domain
   */
  static async getConnectionByShop(shopDomain) {
    if (prisma) {
      try {
        const store = await prisma.store.findUnique({
          where: { myshopifyDomain: shopDomain }
        });
        if (store) return store;
      } catch (err) {
        console.warn('[ShopifyRepository] getConnectionByShop fallback:', err.message);
      }
    }
    return fallbackStores.get(shopDomain) || null;
  }

  /**
   * Mark store connection inactive (app/uninstalled)
   */
  static async markInactive(orgIdOrShop) {
    if (prisma) {
      try {
        await prisma.store.updateMany({
          where: {
            OR: [
              { organizationId: orgIdOrShop },
              { myshopifyDomain: orgIdOrShop }
            ]
          },
          data: { status: 'disconnected', accessToken: null }
        });
      } catch (err) {
        console.warn('[ShopifyRepository] markInactive fallback:', err.message);
      }
    }

    const store = fallbackStores.get(orgIdOrShop);
    if (store) {
      store.status = 'disconnected';
      store.accessToken = null;
    }
    return { status: 'disconnected' };
  }

  /**
   * Save OAuth state nonce with expiration (10 min)
   */
  static async saveOAuthState(state, orgId, expiresAt) {
    oauthStates.set(state, { orgId, expiresAt: expiresAt || (Date.now() + 10 * 60 * 1000) });
    return true;
  }

  /**
   * Verify and consume OAuth state nonce
   */
  static async verifyAndConsumeOAuthState(state) {
    if (!state) return null;
    const entry = oauthStates.get(state);
    if (!entry) return null;

    oauthStates.delete(state); // Consume nonce (one-time use)

    if (Date.now() > entry.expiresAt) {
      return null; // Expired
    }

    return entry;
  }
}
