import sqlite3 from 'sqlite3';
import { NextResponse } from 'next/server';

export async function GET() {
  const db = new sqlite3.Database('/home/shantanu/self/Arboreo/db/database.db');

  return new Promise((resolve) => {
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }
      db.close();
      resolve(NextResponse.json({ setupComplete: row.count > 0 }));
    });
  });
}
