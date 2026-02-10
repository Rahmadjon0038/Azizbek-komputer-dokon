const db = require('../config/db');

const mapComputer = (row) => ({
  id: row.id,
  name: row.name,
  price: row.price,
  img: row.img,
  cat: row.cat,
  isLiked: Boolean(row.is_liked),
  inCart: Boolean(row.in_cart),
  created_at: row.created_at,
});

const getAllComputers = () => {
  const stmt = db.prepare(`
    SELECT
      c.id,
      c.name,
      c.price,
      c.img,
      COALESCE(cat.name, '') AS cat,
      c.is_liked,
      c.in_cart,
      c.created_at
    FROM computers c
    LEFT JOIN categories cat ON c.category_id = cat.id
    ORDER BY c.id DESC
  `);

  return stmt.all().map(mapComputer);
};

const getComputerById = (id) => {
  const stmt = db.prepare(`
    SELECT
      c.id,
      c.name,
      c.price,
      c.img,
      COALESCE(cat.name, '') AS cat,
      c.is_liked,
      c.in_cart,
      c.created_at
    FROM computers c
    LEFT JOIN categories cat ON c.category_id = cat.id
    WHERE c.id = ?
  `);

  const row = stmt.get(id);
  return row ? mapComputer(row) : null;
};

const createComputer = ({ name, price, img, categoryId }) => {
  const stmt = db.prepare(
    `INSERT INTO computers (name, price, img, category_id, is_liked, in_cart)
     VALUES (?, ?, ?, ?, 0, 0)`
  );
  const info = stmt.run(name, price, img, categoryId || null);
  return info.lastInsertRowid;
};

const updateComputerLike = (id, isLiked) => {
  const stmt = db.prepare('UPDATE computers SET is_liked = ? WHERE id = ?');
  return stmt.run(isLiked ? 1 : 0, id);
};

const updateComputerCart = (id, inCart) => {
  const stmt = db.prepare('UPDATE computers SET in_cart = ? WHERE id = ?');
  return stmt.run(inCart ? 1 : 0, id);
};

const deleteComputerById = (id) => {
  const stmt = db.prepare('DELETE FROM computers WHERE id = ?');
  return stmt.run(id);
};

module.exports = {
  getAllComputers,
  getComputerById,
  createComputer,
  updateComputerLike,
  updateComputerCart,
  deleteComputerById,
};
