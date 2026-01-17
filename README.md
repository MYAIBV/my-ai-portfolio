# My AI Portfolio

A React-based portfolio/showcase web app for displaying AI projects to customers.

## Features

- **Showcase area** with preview images, descriptions, and links to hosted apps
- **Hybrid visibility**: Items can be public or private (login required)
- **Invite-only auth**: Only whitelisted users can access
- **CRUD**: Logged-in users can add/edit/delete items
- **Categories**: voice, whatsapp, chat, image, video, automation, other
- **Search**: Filter by keywords, description, categories
- **i18n**: Dutch (nl) and English (en)
- **Dark/Light mode**

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **i18n**: next-intl
- **Auth**: Custom JWT with httpOnly cookies
- **Storage**: Vercel KV (Redis-based)
- **Images**: Vercel Blob

## Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3010](http://localhost:3010)

### Default Login (Local Development)

For local development without Vercel KV configured, use these credentials:
- **Email**: `info@my-ai.nl`
- **Password**: `admin123`

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Vercel KV (required for data storage)
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Vercel Blob (required for image uploads)
BLOB_READ_WRITE_TOKEN=

# JWT Secret (required - change this in production!)
JWT_SECRET=your-super-secret-jwt-key
```

## Production Deployment (Vercel)

### 1. Create Vercel Project
1. Import the GitHub repo in Vercel
2. Vercel will auto-detect Next.js settings

### 2. Set Up Vercel KV (Data Storage)
1. Go to your project → **Storage** tab
2. Click **Create Database** → **KV**
3. This auto-adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` to your environment

### 3. Set Up Vercel Blob (Image Storage)
1. Go to your project → **Storage** tab
2. Click **Create Database** → **Blob**
3. This auto-adds `BLOB_READ_WRITE_TOKEN` to your environment

### 4. Set JWT Secret
1. Go to **Settings** → **Environment Variables**
2. Add `JWT_SECRET` with a secure random string

### 5. Add Users
After configuring Vercel KV, add users with the seed script:

```bash
# Set environment variables first (copy from Vercel dashboard)
export KV_REST_API_URL=your_url
export KV_REST_API_TOKEN=your_token

# Add a user
node scripts/add-user.mjs --email info@my-ai.nl --password yourpassword --name "Admin"
```

### 6. Add Custom Domain (Optional)
1. Go to **Settings** → **Domains**
2. Add `portfolio.my-ai.nl`
3. Configure DNS with CNAME record pointing to `cname.vercel-dns.com`

## Project Structure

```
my-ai-portfolio/
├── app/
│   ├── [locale]/           # i18n routing
│   │   ├── layout.tsx      # Root layout with providers
│   │   ├── page.tsx        # Home - public showcase grid
│   │   ├── login/
│   │   ├── dashboard/      # Private items + management
│   │   └── showcase/       # Add/edit items
│   └── api/
│       ├── auth/           # Login, logout, me
│       ├── showcase/       # CRUD operations
│       └── upload/         # Image upload (Vercel Blob)
├── components/
│   ├── ui/                 # Button, Card, Input, etc.
│   ├── layout/             # Header, Footer, ThemeToggle
│   └── showcase/           # Grid, Card, Form, CategoryFilter
├── lib/                    # Utilities (kv, auth)
├── hooks/                  # useAuth
├── messages/               # i18n translations (nl.json, en.json)
└── i18n/                   # i18n configuration
```

## Scripts

- `npm run dev` - Start development server on port 3010
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT

