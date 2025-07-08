const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Generate RSA key pair for JWT signing (in production, store these securely)
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

const JWT_CONFIG = {
  privateKey,
  publicKey,
  algorithm: 'RS256',
  expiresIn: '24h'
};

function generateToken(payload) {
  return jwt.sign(payload, JWT_CONFIG.privateKey, {
    algorithm: JWT_CONFIG.algorithm,
    expiresIn: JWT_CONFIG.expiresIn
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_CONFIG.publicKey, {
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