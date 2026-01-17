import { ShowcaseItem, User } from './types';

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

// In-memory fallback for local development without KV
const memoryStore: {
  showcaseItems: Record<string, ShowcaseItem>;
  users: Record<string, User>;
} = {
  showcaseItems: {},
  users: {
    // Default admin user for local development (password: admin123)
    'info@my-ai.nl': {
      email: 'info@my-ai.nl',
      passwordHash: '$2a$12$mGdtk3sg14L4e4fV8BX7PeD4L0acez3fizrM4hHLQt4ZL0q8ClLJC', // admin123
      name: 'Admin',
      createdAt: new Date().toISOString(),
    },
  },
};

// Showcase Items
export async function getAllShowcaseItems(): Promise<ShowcaseItem[]> {
  const kv = await getKV();
  if (!kv) {
    return Object.values(memoryStore.showcaseItems);
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
    return memoryStore.showcaseItems[id] || null;
  }

  try {
    const item = await kv.hget<ShowcaseItem>(SHOWCASE_KEY, id);
    return item;
  } catch (error) {
    console.error('Error getting showcase item:', error);
    return null;
  }
}

export async function createShowcaseItem(item: ShowcaseItem): Promise<ShowcaseItem> {
  const kv = await getKV();
  if (!kv) {
    memoryStore.showcaseItems[item.id] = item;
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
    memoryStore.showcaseItems[id] = updated;
    return updated;
  }

  await kv.hset(SHOWCASE_KEY, { [id]: updated });
  return updated;
}

export async function deleteShowcaseItem(id: string): Promise<boolean> {
  const kv = await getKV();
  if (!kv) {
    if (memoryStore.showcaseItems[id]) {
      delete memoryStore.showcaseItems[id];
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
    return memoryStore.users[email] || null;
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
    memoryStore.users[user.email] = user;
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
    memoryStore.users[email] = updated;
    return updated;
  }

  await kv.hset(USERS_KEY, { [email]: updated });
  return updated;
}

export async function deleteUser(email: string): Promise<boolean> {
  const kv = await getKV();
  if (!kv) {
    if (memoryStore.users[email]) {
      delete memoryStore.users[email];
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
    return Object.values(memoryStore.users);
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
