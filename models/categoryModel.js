const db = require('../config/db');

const getAllCategories = () => {
  const stmt = db.prepare('SELECT id, name, created_at FROM categories ORDER BY id DESC');
  return stmt.all();
};

const createCategory = (name) => {
  const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
  const info = stmt.run(name);
  return info.lastInsertRowid;
};

const getCategoryByName = (name) => {
  const stmt = db.prepare('SELECT * FROM categories WHERE name = ?');
  return stmt.get(name);
};

const getCategoryById = (id) => {
  const stmt = db.prepare('SELECT * FROM categories WHERE id = ?');
  return stmt.get(id);
};

const deleteCategoryById = (id) => {
  const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
  return stmt.run(id);
};

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryByName,
  getCategoryById,
  deleteCategoryById,
};
