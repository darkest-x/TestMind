/**
 * Validation middleware for TestMind API
 */

const { ApiResponse } = require('../models');

exports.validateCreateUser = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || username.length < 3 || username.length > 50) {
    errors.push('Username must be between 3 and 50 characters');
  }

  if (!email || !email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json(ApiResponse.error(errors.join(', ')));
  }

  next();
};

exports.validateUpdateUser = (req, res, next) => {
  const { username, email } = req.body;
  const errors = [];

  if (username !== undefined && (username.length < 3 || username.length > 50)) {
    errors.push('Username must be between 3 and 50 characters');
  }

  if (email !== undefined && !email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (errors.length > 0) {
    return res.status(400).json(ApiResponse.error(errors.join(', ')));
  }

  next();
};
