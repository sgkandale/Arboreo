
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS family_data (
      id INTEGER PRIMARY KEY,
      name TEXT,
      gender TEXT,
      dob TEXT,
      parents TEXT,
      spouse TEXT,
      children TEXT
    )
  `);
});

db.close();
