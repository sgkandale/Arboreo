import sqlite3 from 'sqlite3';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const db = new sqlite3.Database('/home/shantanu/self/Arboreo/db/database.db');
  const person = await req.json();

  return new Promise((resolve) => {
    db.run(
      'INSERT OR REPLACE INTO family_data (id, name, gender, dob, deathDate, location, profession, biography, contactInfo, photo, parents, spouse, children) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        person.id,
        person.name,
        person.gender,
        person.dateOfBirth,
        person.deathDate || null,
        person.location || null,
        person.profession || null,
        person.biography || null,
        person.contactInfo ? JSON.stringify(person.contactInfo) : null,
        person.photo || null,
        JSON.stringify(person.parents || []),
        JSON.stringify(person.spouse || []),
        JSON.stringify(person.children || []),
      ],
      (err) => {
        if (err) {
          resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          return;
        }
        db.close();
        resolve(NextResponse.json({ message: 'Person updated successfully' }));
      }
    );
  });
}
