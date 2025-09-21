import sqlite3 from 'sqlite3';
import { NextResponse } from 'next/server';

export async function GET() {
  const db = new sqlite3.Database('/home/shantanu/self/Arboreo/db/database.db');

  return new Promise((resolve) => {
    db.all('SELECT * FROM family_data', (err, rows) => {
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }
      db.close();
      const data = rows.map(row => ({
        id: row.id,
        name: row.name,
        gender: row.gender,
        dateOfBirth: row.dob, // Map dob to dateOfBirth
        deathDate: row.deathDate,
        location: row.location,
        profession: row.profession,
        biography: row.biography,
        contactInfo: row.contactInfo ? JSON.parse(row.contactInfo) : undefined,
        photo: row.photo,
        parents: JSON.parse(row.parents),
        spouse: JSON.parse(row.spouse),
        children: JSON.parse(row.children),
      }))
      resolve(NextResponse.json({people: data}));
    });
  });
}
