/**
 * REVIXA BACKEND — GLOBAL ERROR HANDLING MIDDLEWARE
 * backend/src/middleware/error.js
 */

import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[REVIXA ERROR]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, statusCode, err.errors || null);
};
