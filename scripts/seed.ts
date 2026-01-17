/**
 * Seed script to create initial admin user
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed.ts
 *
 * Or set environment variables and run:
 *   KV_REST_API_URL=xxx KV_REST_API_TOKEN=xxx npm run seed
 *
 * To add a custom user:
 *   npm run seed -- --email admin@my-ai.nl --password secret123 --name "Admin User"
 */

import { createClient } from '@vercel/kv';
import bcrypt from 'bcryptjs';

interface User {
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

async function main() {
  const args = process.argv.slice(2);

  // Parse command line arguments
  let email = 'admin@my-ai.nl';
  let password = 'admin123';
  let name = 'Admin';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      email = args[i + 1];
      i++;
    } else if (args[i] === '--password' && args[i + 1]) {
      password = args[i + 1];
      i++;
    } else if (args[i] === '--name' && args[i + 1]) {
      name = args[i + 1];
      i++;
    }
  }

  // Check environment variables
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error('Error: KV_REST_API_URL and KV_REST_API_TOKEN environment variables are required.');
    console.error('\nMake sure you have:');
    console.error('1. Created a Vercel KV database in your Vercel project');
    console.error('2. Set the environment variables in .env.local or your environment');
    process.exit(1);
  }

  const kv = createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });

  console.log(`Creating user: ${email}`);

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  const user: User = {
    email,
    passwordHash,
    name,
    createdAt: new Date().toISOString(),
  };

  // Store user in KV
  await kv.hset('users', { [email]: user });

  console.log('User created successfully!');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('\nYou can now log in with these credentials.');
}

main().catch(console.error);
