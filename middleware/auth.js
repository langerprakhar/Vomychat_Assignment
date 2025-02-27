const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Invalid token:", err.message);
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      console.error("Invalid decoded token format");
      return res.status(401).json({ message: 'Invalid token format' });
    }

    req.userId = decoded.userId;
    console.log(`User authenticated: ${req.userId}`);
    next();
  });
};

module.exports = { authenticate };
