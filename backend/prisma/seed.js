/**
 * REVIXA BACKEND — DATABASE SEED SCRIPT
 * backend/prisma/seed.js
 * 
 * Populates PostgreSQL database with Revixa's business narrative data:
 * Organization: L'Élégance Paris
 * Store: L'Élégance Paris (Shopify Plus)
 * Products: Silk Blazer SKU #881, Cashmere Crewneck #104, Slim Linen Trouser #410
 * Recommendations: Restock SKU #881, Scale Meta Creative #12
 * Audit logs & Notifications
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[SEED] Starting database seeding for Revixa...');

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { id: 'org_legance_paris' },
    update: {},
    create: {
      id: 'org_legance_paris',
      name: "L'ÉLÉGANCE PARIS"
    }
  });
  console.log('[SEED] Organization created:', org.name);

  // 2. Create Owner User
  const user = await prisma.user.upsert({
    where: { email: 'julian@yourstore.com' },
    update: {},
    create: {
      name: 'Julian Vance',
      email: 'julian@yourstore.com',
      passwordHash: bcrypt.hashSync('Password123!', 10),
      role: 'Owner',
      organizationId: org.id
    }
  });
  console.log('[SEED] Owner User created:', user.email);

  // 3. Create Store
  const store = await prisma.store.upsert({
    where: { myshopifyDomain: 'elegance-paris.myshopify.com' },
    update: {},
    create: {
      name: "L'ÉLÉGANCE PARIS",
      domain: "leganceparis.com",
      myshopifyDomain: "elegance-paris.myshopify.com",
      status: "connected",
      organizationId: org.id
    }
  });
  console.log('[SEED] Store created:', store.name);

  // 4. Create Products
  await prisma.product.deleteMany({ where: { storeId: store.id } });
  const p1 = await prisma.product.create({
    data: {
      storeId: store.id,
      title: 'Silk Executive Blazer',
      sku: 'SKU #881',
      price: 295.0,
      costPrice: 93.2,
      margin: 68.4,
      inventoryUnits: 42,
      dailyRunRate: 8.1,
      daysRemaining: 5.2,
      status: 'risk'
    }
  });
  const p2 = await prisma.product.create({
    data: {
      storeId: store.id,
      title: 'Cashmere Crewneck Sweater',
      sku: 'SKU #104',
      price: 185.0,
      costPrice: 47.7,
      margin: 74.2,
      inventoryUnits: 180,
      dailyRunRate: 2.4,
      daysRemaining: 42.8,
      status: 'healthy'
    }
  });
  console.log('[SEED] Products created:', p1.sku, p2.sku);

  // 5. Create Recommendations
  await prisma.recommendation.deleteMany({ where: { storeId: store.id } });
  const rec1 = await prisma.recommendation.create({
    data: {
      storeId: store.id,
      title: 'Restock Silk Blazer SKU #881',
      observation: 'Revenue increased +$28,600 (+18.4%) this week while total ad spend remained flat.',
      rootCause: 'Meta target shift toward high-AOV demographic (Ages 28-44) + mobile speed gain (+400ms faster).',
      evidence: [
        'Meta Creative #12 generated 64% of new conversions',
        'Safari Mobile load time decreased from 1.4s to 1.0s',
        'Cart-to-checkout conversion improved from 2.8% to 3.42%'
      ],
      recommendation: 'Restock Silk Blazer SKU #881 & scale Meta Creative #12 budget by +$750/day.',
      expectedImpact: 'Prevent -$34,000 in lost stockout revenue & capture +$18,400 profit gain.',
      confidenceScore: 96.2,
      status: 'PENDING'
    }
  });
  console.log('[SEED] Recommendation created:', rec1.title);

  // 6. Create Setting
  await prisma.setting.upsert({
    where: { storeId: store.id },
    update: {},
    create: {
      storeId: store.id,
      minMarginGuardrail: 55.0
    }
  });

  console.log('[SEED] Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('[SEED ERROR]:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
