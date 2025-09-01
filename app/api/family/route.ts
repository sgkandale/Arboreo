import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  // Find the absolute path to the db.json file
  const jsonDirectory = path.join(process.cwd(), 'db.json');
  // Read the file content
  const fileContents = await fs.readFile(jsonDirectory, 'utf8');
  // Parse the JSON data
  const data = JSON.parse(fileContents);
  // Return the data as a JSON response
  return NextResponse.json(data);
}
