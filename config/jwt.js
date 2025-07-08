const jwt = require('jsonwebtoken');

// Static secret key for JWT signing (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'limebyte-blog-secret-key-2024';

const JWT_CONFIG = {
  secret: JWT_SECRET,
  algorithm: 'HS256',
  expiresIn: '24h'
};

function generateToken(payload) {
  return jwt.sign(payload, JWT_CONFIG.secret, {
    algorithm: JWT_CONFIG.algorithm,
    expiresIn: JWT_CONFIG.expiresIn
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_CONFIG.secret, {
      algorithms: [JWT_CONFIG.algorithm]
    });
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
  JWT_CONFIG
}; 