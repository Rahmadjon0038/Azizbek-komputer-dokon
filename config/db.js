const Database = require('better-sqlite3');

let db;

try {
  db = new Database('./database.sqlite', { verbose: console.log });
  console.log('✅ SQLite DB muvaffaqiyatli ulandi!');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      refresh_token TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS computers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      img TEXT NOT NULL,
      category_id INTEGER,
      is_liked INTEGER NOT NULL DEFAULT 0,
      in_cart INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
  `);

  const categoryCount = db.prepare('SELECT COUNT(*) AS total FROM categories').get();
  if (categoryCount.total === 0) {
    db.prepare('INSERT INTO categories (name) VALUES (?)').run('Kampyuter');
  }

  const computerCount = db.prepare('SELECT COUNT(*) AS total FROM computers').get();
  if (computerCount.total === 0) {
    const defaultCategory = db.prepare('SELECT id FROM categories WHERE name = ?').get('Kampyuter');
    db.prepare(
      `INSERT INTO computers (name, price, img, category_id, is_liked, in_cart)
       VALUES (?, ?, ?, ?, 0, 0)`
    ).run(
      'AZ1K Gaming Extreme',
      '18 500 000',
      'https://files.ox-sys.com/cache/500x_/image/21/d7/5e/21d75e0563ebf4665abdb57a5b75b74d0a3ef36e75787d1aec713a95af7d7f0c.webp',
      defaultCategory ? defaultCategory.id : null
    );
  }
} catch (err) {
  console.error('❌ DB bilan ulanishda xato:', err.message);
  process.exit(1); // serverni to‘xtatish, chunki DB ishlamasa davom etmaydi
}

module.exports = db;
