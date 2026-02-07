const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  createUser,
  getUserByPhone,
  getUserById,
  getUserByRefreshToken,
  updateRefreshToken,
} = require('../models/userModel');

const accessSecret = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
const accessExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const refreshExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

const buildTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role, phone: user.phone },
    accessSecret,
    { expiresIn: accessExpiresIn }
  );

  const refreshToken = jwt.sign(
    { id: user.id, role: user.role, phone: user.phone },
    refreshSecret,
    { expiresIn: refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

const register = (req, res) => {
  const firstName = req.body.firstName || req.body.ism || '';
  const lastName = req.body.lastName || req.body.familiya || '';
  const password = req.body.password || req.body.parol;
  const phone = req.body.phone || req.body.telefon;

  if (!firstName || !lastName || !password || !phone) {
    return res.status(400).json({ message: 'Barcha maydonlar to‘ldirilishi shart' });
  }

  const exists = getUserByPhone(phone);
  if (exists) {
    return res.status(409).json({ message: 'Telefon raqam allaqachon ro‘yxatdan o‘tgan' });
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const passwordHash = bcrypt.hashSync(password, 10);

  const userId = createUser({ fullName, phone, passwordHash, role: 'user' });
  const user = { id: userId, role: 'user', phone };

  const { accessToken, refreshToken } = buildTokens(user);
  updateRefreshToken(userId, refreshToken);

  return res.status(201).json({
    message: 'Muvaffaqiyatli ro‘yxatdan o‘tildi',
    user: { id: userId, fullName, phone, role: 'user' },
    accessToken,
    refreshToken,
  });
};

const login = (req, res) => {
  const password = req.body.password || req.body.parol;
  const phone = req.body.phone || req.body.telefon;

  if (!phone || !password) {
    return res.status(400).json({ message: 'Telefon raqam va parol majburiy' });
  }

  const user = getUserByPhone(phone);
  if (!user) {
    return res.status(401).json({ message: 'Telefon raqam yoki parol xato' });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Telefon raqam yoki parol xato' });
  }

  const { accessToken, refreshToken } = buildTokens(user);
  updateRefreshToken(user.id, refreshToken);

  return res.json({
    message: 'Muvaffaqiyatli login',
    user: {
      id: user.id,
      fullName: user.full_name,
      phone: user.phone,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
};

const profile = (req, res) => {
  const user = getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
  }

  return res.json({ user });
};

const refresh = (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token majburiy' });
  }

  try {
    const payload = jwt.verify(refreshToken, refreshSecret);
    const user = getUserByRefreshToken(refreshToken);

    if (!user || user.id !== payload.id) {
      return res.status(401).json({ message: 'Refresh token yaroqsiz' });
    }

    const tokens = buildTokens(user);
    updateRefreshToken(user.id, tokens.refreshToken);

    return res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    return res.status(401).json({ message: 'Refresh token yaroqsiz yoki muddati tugagan' });
  }
};

module.exports = {
  register,
  login,
  profile,
  refresh,
};
