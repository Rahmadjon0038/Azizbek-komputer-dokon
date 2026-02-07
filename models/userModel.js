const db = require('../config/db');

const createUser = ({ fullName, phone, passwordHash, role = 'user', refreshToken = null }) => {
  const stmt = db.prepare(
    `INSERT INTO users (full_name, phone, password_hash, role, refresh_token)
     VALUES (@fullName, @phone, @passwordHash, @role, @refreshToken)`
  );
  const info = stmt.run({ fullName, phone, passwordHash, role, refreshToken });
  return info.lastInsertRowid;
};

const getUserByPhone = (phone) => {
  const stmt = db.prepare('SELECT * FROM users WHERE phone = ?');
  return stmt.get(phone);
};

const getUserById = (id) => {
  const stmt = db.prepare('SELECT id, full_name, phone, role, created_at FROM users WHERE id = ?');
  return stmt.get(id);
};

const getUserByRefreshToken = (refreshToken) => {
  const stmt = db.prepare('SELECT * FROM users WHERE refresh_token = ?');
  return stmt.get(refreshToken);
};

const updateRefreshToken = (id, refreshToken) => {
  const stmt = db.prepare('UPDATE users SET refresh_token = ? WHERE id = ?');
  return stmt.run(refreshToken, id);
};

module.exports = {
  createUser,
  getUserByPhone,
  getUserById,
  getUserByRefreshToken,
  updateRefreshToken,
};
