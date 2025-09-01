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

      if (!user) {
        resolve(NextResponse.json({ error: 'Invalid username or password' }, { status: 400 }));
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        resolve(NextResponse.json({ error: 'Invalid username or password' }, { status: 400 }));
        return;
      }

      db.close();
      // Here you would typically create a session or JWT token
      resolve(NextResponse.json({ message: 'Logged in successfully' }));
    });
  });
}
