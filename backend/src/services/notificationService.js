/**
 * REVIXA BACKEND — NOTIFICATION SERVICE LAYER
 * backend/src/services/notificationService.js
 * 
 * Business logic layer. Calls NotificationRepository ONLY.
 */

import { NotificationRepository } from '../repositories/NotificationRepository.js';

export class NotificationService {
  static async getNotifications(userId) {
    return await NotificationRepository.findNotifications(userId);
  }
}
