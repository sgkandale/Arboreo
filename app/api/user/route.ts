import sqlite3 from 'sqlite3';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const db = new sqlite3.Database('/home/shantanu/self/Arboreo/db/database.db');
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  return new Promise((resolve) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }

      if (!user) {
        resolve(NextResponse.json({ error: 'User not found' }, { status: 404 }));
        return;
      }

      db.get('SELECT * FROM family_data WHERE id = ?', [user.id], (err, person) => {
        if (err) {
          resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          return;
        }

        db.close();
        resolve(NextResponse.json({ user, person }));
      });
    });
  });
}
