import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('/home/shantanu/self/Arboreo/db/database.db');

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
      parents TEXT,
      spouse TEXT,
      children TEXT
    )
  `);
});

db.close();
