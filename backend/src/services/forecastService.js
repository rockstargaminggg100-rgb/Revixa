/**
 * REVIXA BACKEND — FORECAST SERVICE LAYER
 * backend/src/services/forecastService.js
 * 
 * Business logic layer. Calls ForecastRepository ONLY.
 */

import { ForecastRepository } from '../repositories/ForecastRepository.js';

export class ForecastService {
  static async getForecastData(storyId = 'story_001') {
    return await ForecastRepository.findForecast(storyId);
  }
}
