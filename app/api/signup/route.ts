import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const db = new sqlite3.Database('/home/shantanu/self/Arboreo/db/database.db');
  const { username, password } = await req.json();

  return new Promise((resolve) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }

      if (user) {
        resolve(NextResponse.json({ error: 'Username already exists' }, { status: 400 }));
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) {
          resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          return;
        }

        db.close();
        resolve(NextResponse.json({ message: 'User created successfully' }));
      });
    });
  });
}
