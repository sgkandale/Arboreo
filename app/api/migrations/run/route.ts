import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';

export async function POST(req: Request) {
  return new Promise((resolve) => {
    const db = new sqlite3.Database('/home/shantanu/self/Arboreo/db/database.db');

    db.on('error', (err) => {
      console.error("Database error:", err.message);
      resolve(NextResponse.json({ error: 'Database error', details: err.message }, { status: 500 }));
    });

    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT
        )
      `, (err) => {
        if (err) {
          console.error("Error creating users table:", err.message);
          resolve(NextResponse.json({ error: 'Migration failed', details: err.message }, { status: 500 }));
          return;
        }
        console.log("Users table created or already exists.");
      });

      db.run(`
        CREATE TABLE IF NOT EXISTS family_data (
          id INTEGER PRIMARY KEY,
          name TEXT,
          gender TEXT,
          dob TEXT,
          deathDate TEXT,
          location TEXT,
          profession TEXT,
          biography TEXT,
          contactInfo TEXT,
          photo TEXT,
          parents TEXT,
          spouse TEXT,
          children TEXT
        )
      `, (err) => {
        if (err) {
          console.error("Error creating family_data table:", err.message);
          resolve(NextResponse.json({ error: 'Migration failed', details: err.message }, { status: 500 }));
          return;
        }
        console.log("Family_data table created or already exists.");
        resolve(NextResponse.json({ message: 'Migrations run successfully' }));
        db.close(); // Close database after all operations are done
      });
    });
  });
}
