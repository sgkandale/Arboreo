import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable for production

export async function POST(req: Request) {
  const db = new sqlite3.Database('/home/shantanu/self/Arboreo/db/database.db');
  const { username, password } = await req.json();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return new Promise((resolve) => {
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }

      if (row.count > 0) {
        resolve(NextResponse.json({ error: 'Setup already complete' }, { status: 400 }));
        return;
      }

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
