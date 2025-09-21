import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable for production

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

      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
        if (err) {
          resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          return;
        }

        const userId = this.lastID;
        const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '1h' });

        db.close();
        resolve(NextResponse.json({ message: 'User created successfully', token }));
      });
    });
  });
}
