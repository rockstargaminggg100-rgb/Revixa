/**
 * REVIXA BACKEND — STORE REPOSITORY
 * backend/src/repositories/StoreRepository.js
 * 
 * Repository pattern for Store, Product, Order, Customer persistence.
 * Only layer allowed to perform Prisma queries for Store entity.
 */

import prisma from '../database/prisma.js';

const fallbackStores = new Map();
const fallbackOAuthStates = new Map();

export class StoreRepository {
  /**
   * Save OAuth CSRF State Nonce
   */
  static async saveOAuthState(state, orgId, expiresAt) {
    fallbackOAuthStates.set(state, { state, orgId, expiresAt });
    return { state, orgId, expiresAt };
  }

  /**
   * Verify and consume OAuth State Nonce (Prevents replay attacks)
   */
  static async verifyAndConsumeOAuthState(state) {
    if (!state) return null;
    const entry = fallbackOAuthStates.get(state);
    if (!entry) return null;

    // Delete nonce on first read to prevent replay attacks
    fallbackOAuthStates.delete(state);

    if (Date.now() > entry.expiresAt) {
      return null;
    }
    return entry;
  }

  /**
   * Save or update connected Shopify store
   */
  static async saveConnection(organizationId, shopDomain, encryptedAccessToken, scopes = 'read_orders,read_products,read_inventory,read_customers') {
    const cleanDomain = shopDomain.toLowerCase().trim();

    if (prisma) {
      try {
        const existingStore = await prisma.store.findUnique({
          where: { myshopifyDomain: cleanDomain }
        });

        if (existingStore) {
          const updated = await prisma.store.update({
            where: { id: existingStore.id },
            data: {
              accessToken: encryptedAccessToken,
              status: 'connected',
              updatedAt: new Date()
            }
          });
          return updated;
        }

        const created = await prisma.store.create({
          data: {
            organizationId,
            name: cleanDomain.split('.')[0].toUpperCase(),
            domain: cleanDomain,
            myshopifyDomain: cleanDomain,
            accessToken: encryptedAccessToken,
            status: 'connected'
          }
        });
        return created;
      } catch (err) {
        console.warn('[StoreRepository] saveConnection query fallback:', err.message);
      }
    }

    const storeObj = {
      id: `str_${Date.now()}`,
      organizationId,
      name: cleanDomain.split('.')[0].toUpperCase(),
      domain: cleanDomain,
      myshopifyDomain: cleanDomain,
      accessToken: encryptedAccessToken,
      scopes,
      status: 'connected',
      installedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    fallbackStores.set(cleanDomain, storeObj);
    fallbackStores.set(organizationId, storeObj);
    return storeObj;
  }

  /**
   * Get store connection by organization ID
   */
  static async getConnection(organizationId) {
    if (prisma) {
      try {
        const store = await prisma.store.findFirst({
          where: { organizationId, status: 'connected' }
        });
        if (store) return store;
      } catch (err) {
        console.warn('[StoreRepository] getConnection fallback:', err.message);
      }
    }
    return fallbackStores.get(organizationId) || null;
  }

  /**
   * Get store connection by myshopify domain
   */
  static async getConnectionByShop(shopDomain) {
    const cleanDomain = shopDomain.toLowerCase().trim();
    if (prisma) {
      try {
        const store = await prisma.store.findUnique({
          where: { myshopifyDomain: cleanDomain }
        });
        if (store) return store;
      } catch (err) {
        console.warn('[StoreRepository] getConnectionByShop fallback:', err.message);
      }
    }
    return fallbackStores.get(cleanDomain) || null;
  }

  /**
   * Mark store inactive/disconnected (App uninstalled)
   */
  static async markInactive(shopDomain) {
    const cleanDomain = shopDomain.toLowerCase().trim();
    if (prisma) {
      try {
        await prisma.store.updateMany({
          where: { myshopifyDomain: cleanDomain },
          data: {
            status: 'disconnected',
            accessToken: null,
            updatedAt: new Date()
          }
        });
      } catch (err) {
        console.warn('[StoreRepository] markInactive fallback:', err.message);
      }
    }

    const store = fallbackStores.get(cleanDomain);
    if (store) {
      store.status = 'disconnected';
      store.accessToken = null;
    }
    return { status: 'disconnected' };
  }

  /**
   * Bulk insert synced products
   */
  static async syncProducts(storeId, products) {
    if (prisma && storeId) {
      try {
        for (const p of products) {
          await prisma.product.upsert({
            where: { sku: p.sku },
            update: { price: p.price, inventoryUnits: p.inventoryUnits, daysRemaining: p.daysRemaining },
            create: {
              storeId,
              title: p.title,
              sku: p.sku,
              price: p.price,
              costPrice: p.costPrice || p.price * 0.4,
              margin: p.margin || 60.0,
              inventoryUnits: p.inventoryUnits,
              dailyRunRate: p.dailyRunRate || 5.0,
              daysRemaining: p.daysRemaining,
              status: p.status || 'healthy'
            }
          });
        }
      } catch (err) {
        console.warn('[StoreRepository] syncProducts fallback:', err.message);
      }
    }
  }

  /**
   * Bulk insert synced orders
   */
  static async syncOrders(storeId, orders) {
    if (prisma && storeId) {
      try {
        for (const o of orders) {
          await prisma.order.upsert({
            where: { orderNumber: o.orderNumber },
            update: { totalPrice: o.totalPrice },
            create: {
              storeId,
              orderNumber: o.orderNumber,
              totalPrice: o.totalPrice
            }
          });
        }
      } catch (err) {
        console.warn('[StoreRepository] syncOrders fallback:', err.message);
      }
    }
  }
}
