const jwt = require('jsonwebtoken');

module.exports.verifyAdmin = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user's role is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Attach the decoded information to the request object
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};
