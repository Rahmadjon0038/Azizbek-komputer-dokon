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
} catch (err) {
  console.error('❌ DB bilan ulanishda xato:', err.message);
  process.exit(1); // serverni to‘xtatish, chunki DB ishlamasa davom etmaydi
}

module.exports = db;
