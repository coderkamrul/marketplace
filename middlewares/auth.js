// middleware/authenticate.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in env
    req.user = decoded; // Attach the decoded user information to the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
