/**
 * REVIXA BACKEND — CUSTOMER SERVICE LAYER
 * backend/src/services/customerService.js
 * 
 * Business logic layer. Calls CustomersRepository ONLY.
 */

import { CustomersRepository } from '../repositories/CustomersRepository.js';

export class CustomerService {
  static async getCustomerData(storyId = 'story_001') {
    return await CustomersRepository.findCustomers(storyId);
  }
}
