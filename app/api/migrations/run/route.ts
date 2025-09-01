import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: Request) {
  return new Promise((resolve) => {
    const migrationScript = path.join(process.cwd(), 'db', 'migrations.mjs');
    exec(`node ${migrationScript}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Migration error: ${error}`);
        resolve(NextResponse.json({ error: 'Migration failed', details: error.message }, { status: 500 }));
        return;
      }
      if (stderr) {
        console.error(`Migration stderr: ${stderr}`);
      }
      console.log(`Migration stdout: ${stdout}`);
      resolve(NextResponse.json({ message: 'Migrations run successfully' }));
    });
  });
}
