import { ShowcaseItem, User } from './types';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const SHOWCASE_KEY = 'showcase:items';
const USERS_KEY = 'users';

// Check if KV is configured
const isKVConfigured = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

// Lazy load KV client to avoid import errors when not configured
let kvClient: typeof import('@vercel/kv').kv | null = null;
async function getKV() {
  if (!isKVConfigured()) return null;
  if (!kvClient) {
    const { kv } = await import('@vercel/kv');
    kvClient = kv;
  }
  return kvClient;
}

// Local JSON file storage for development
const DATA_DIR = path.join(process.cwd(), '.data');
const SHOWCASE_FILE = path.join(DATA_DIR, 'showcase.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readLocalShowcase(): Record<string, ShowcaseItem> {
  try {
    if (existsSync(SHOWCASE_FILE)) {
      return JSON.parse(readFileSync(SHOWCASE_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading showcase file:', e);
  }
  return {};
}

function writeLocalShowcase(data: Record<string, ShowcaseItem>) {
  ensureDataDir();
  writeFileSync(SHOWCASE_FILE, JSON.stringify(data, null, 2));
}

function readLocalUsers(): Record<string, User> {
  try {
    if (existsSync(USERS_FILE)) {
      return JSON.parse(readFileSync(USERS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading users file:', e);
  }
  // Default admin user for local development (password: admin123)
  return {
    'info@my-ai.nl': {
      email: 'info@my-ai.nl',
      passwordHash: '$2a$12$mGdtk3sg14L4e4fV8BX7PeD4L0acez3fizrM4hHLQt4ZL0q8ClLJC',
      name: 'Admin',
      createdAt: new Date().toISOString(),
    },
  };
}

function writeLocalUsers(data: Record<string, User>) {
  ensureDataDir();
  writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

// Showcase Items
export async function getAllShowcaseItems(): Promise<ShowcaseItem[]> {
  const kv = await getKV();
  if (!kv) {
    return Object.values(readLocalShowcase());
  }

  try {
    const items = await kv.hgetall<Record<string, ShowcaseItem>>(SHOWCASE_KEY);
    if (!items) return [];
    return Object.values(items);
  } catch (error) {
    console.error('Error getting showcase items:', error);
    return [];
  }
}

export async function getPublicShowcaseItems(): Promise<ShowcaseItem[]> {
  const items = await getAllShowcaseItems();
  return items.filter(item => item.is_public);
}

export async function getShowcaseItem(id: string): Promise<ShowcaseItem | null> {
  const kv = await getKV();
  if (!kv) {
    const items = readLocalShowcase();
    return items[id] || null;
  }

  try {
    const item = await kv.hget<ShowcaseItem>(SHOWCASE_KEY, id);
    return item;
  } catch (error) {
    console.error('Error getting showcase item:', error);
    return null;
  }
}

export async function getShowcaseItemBySlug(slug: string): Promise<ShowcaseItem | null> {
  const items = await getAllShowcaseItems();
  return items.find((item) => item.slug === slug) || null;
}

export async function isSlugAvailable(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const items = await getAllShowcaseItems();
  return !items.some(
    (item) => item.slug === slug && item.id !== excludeId
  );
}

export async function createShowcaseItem(item: ShowcaseItem): Promise<ShowcaseItem> {
  const kv = await getKV();
  if (!kv) {
    const items = readLocalShowcase();
    items[item.id] = item;
    writeLocalShowcase(items);
    return item;
  }

  await kv.hset(SHOWCASE_KEY, { [item.id]: item });
  return item;
}

export async function updateShowcaseItem(id: string, updates: Partial<ShowcaseItem>): Promise<ShowcaseItem | null> {
  const existing = await getShowcaseItem(id);
  if (!existing) return null;

  const updated: ShowcaseItem = {
    ...existing,
    ...updates,
    id,
    updated_at: new Date().toISOString(),
  };

  const kv = await getKV();
  if (!kv) {
    const items = readLocalShowcase();
    items[id] = updated;
    writeLocalShowcase(items);
    return updated;
  }

  await kv.hset(SHOWCASE_KEY, { [id]: updated });
  return updated;
}

export async function deleteShowcaseItem(id: string): Promise<boolean> {
  const kv = await getKV();
  if (!kv) {
    const items = readLocalShowcase();
    if (items[id]) {
      delete items[id];
      writeLocalShowcase(items);
      return true;
    }
    return false;
  }

  try {
    await kv.hdel(SHOWCASE_KEY, id);
    return true;
  } catch (error) {
    console.error('Error deleting showcase item:', error);
    return false;
  }
}

// Users
export async function getUser(email: string): Promise<User | null> {
  const kv = await getKV();
  if (!kv) {
    const users = readLocalUsers();
    return users[email] || null;
  }

  try {
    const user = await kv.hget<User>(USERS_KEY, email);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function createUser(user: User): Promise<User> {
  const kv = await getKV();
  if (!kv) {
    const users = readLocalUsers();
    users[user.email] = user;
    writeLocalUsers(users);
    return user;
  }

  await kv.hset(USERS_KEY, { [user.email]: user });
  return user;
}

export async function updateUser(email: string, updates: Partial<User>): Promise<User | null> {
  const existing = await getUser(email);
  if (!existing) return null;

  const updated: User = {
    ...existing,
    ...updates,
    email,
  };

  const kv = await getKV();
  if (!kv) {
    const users = readLocalUsers();
    users[email] = updated;
    writeLocalUsers(users);
    return updated;
  }

  await kv.hset(USERS_KEY, { [email]: updated });
  return updated;
}

export async function deleteUser(email: string): Promise<boolean> {
  const kv = await getKV();
  if (!kv) {
    const users = readLocalUsers();
    if (users[email]) {
      delete users[email];
      writeLocalUsers(users);
      return true;
    }
    return false;
  }

  try {
    await kv.hdel(USERS_KEY, email);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

export async function getAllUsers(): Promise<User[]> {
  const kv = await getKV();
  if (!kv) {
    return Object.values(readLocalUsers());
  }

  try {
    const users = await kv.hgetall<Record<string, User>>(USERS_KEY);
    if (!users) return [];
    return Object.values(users);
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}
