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
- **Storage**: Vercel KV (Redis-based) with in-memory fallback for local dev
- **Images**: Cloudinary

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
# Vercel KV (optional for local dev, required for production)
KV_REST_API_URL=
KV_REST_API_TOKEN=

# JWT Secret (required)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Cloudinary (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Production Deployment

### 1. Vercel Setup

1. Create a new Vercel project
2. Link your GitHub repository
3. Enable Vercel KV in project settings
4. Set environment variables in Vercel dashboard

### 2. Add Users

After configuring Vercel KV, add users with the seed script:

```bash
# Set environment variables first
export KV_REST_API_URL=your_url
export KV_REST_API_TOKEN=your_token

# Add a user
node scripts/add-user.mjs --email info@my-ai.nl --password secretpassword --name "Admin User"
```

### 3. Cloudinary Setup (for image uploads)

1. Create a free Cloudinary account
2. Get your API credentials from the dashboard
3. Add them to your environment variables

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
│       └── upload/         # Image upload
├── components/
│   ├── ui/                 # Button, Card, Input, etc.
│   ├── layout/             # Header, Footer, ThemeToggle
│   └── showcase/           # Grid, Card, Form, CategoryFilter
├── lib/                    # Utilities (kv, auth, cloudinary)
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
