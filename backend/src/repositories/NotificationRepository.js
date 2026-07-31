/**
 * REVIXA BACKEND — NOTIFICATION REPOSITORY
 * backend/src/repositories/NotificationRepository.js
 */

import prisma from '../database/prisma.js';

export class NotificationRepository {
  static async findNotifications(userId) {
    if (prisma) {
      try {
        const notifs = await prisma.notification.findMany({ take: 10 });
        if (notifs && notifs.length > 0) {
          return notifs.map(n => ({
            id: n.id,
            type: n.type,
            text: n.message,
            time: 'Just now'
          }));
        }
      } catch (err) {
        console.warn('[NotificationRepository] Query fallback:', err.message);
      }
    }

    return [
      { id: 1, type: 'alert', text: 'Stockout Risk on Silk Blazer SKU #881 (5.2 days left)', time: '2m ago' },
      { id: 2, type: 'insight', text: 'Meta Creative #12 CPA dropped 22%', time: '14m ago' }
    ];
  }
}
