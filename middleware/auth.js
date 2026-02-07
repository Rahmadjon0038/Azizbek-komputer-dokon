const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token topilmadi' });
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'access-secret');
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token yaroqsiz yoki muddati tugagan' });
  }
};

const authorizeRole = (roles = []) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Ruxsat yo‘q' });
  }
  return next();
};

module.exports = { authenticate, authorizeRole };
