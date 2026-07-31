/**
 * REVIXA BACKEND — API RESPONSE UTILITIES
 * backend/src/utils/response.js
 */

export const sendSuccess = (res, data, statusCode = 200, message = 'Success') => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

export const sendError = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors && { errors })
  });
};
