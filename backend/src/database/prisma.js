/**
 * REVIXA BACKEND — SINGLETON PRISMA CLIENT INSTANCE
 * backend/src/database/prisma.js
 * 
 * Repositories are the ONLY layer allowed to import this module.
 */

import { PrismaClient } from '@prisma/client';

let prisma;

try {
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  });
} catch (err) {
  console.warn('[Prisma] Initializing client fallback mode:', err.message);
  prisma = null;
}

export default prisma;
