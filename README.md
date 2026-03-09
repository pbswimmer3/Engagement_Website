# Prad & Aanya — Engagement Website

A four-page engagement website with RSVP, travel info, and FAQ.
Hosted on Vercel, with guest data stored in Supabase.

---

## Table of Contents

1. [Accounts you need to create](#1-accounts-you-need-to-create)
2. [Local setup (run on your computer)](#2-local-setup-run-on-your-computer)
3. [Supabase setup (database)](#3-supabase-setup-database)
4. [Vercel setup (live website)](#4-vercel-setup-live-website)
5. [Customising the site content](#5-customising-the-site-content)
6. [Adding and managing photos](#6-adding-and-managing-photos)
7. [Managing your guest list](#7-managing-your-guest-list)
8. [Viewing RSVP responses](#8-viewing-rsvp-responses)
9. [How to push changes live](#9-how-to-push-changes-live)
10. [Custom domain (optional)](#10-custom-domain-optional)
11. [Password Protection](#11-password-protection)
12. [Background Image](#12-background-image)
13. [File map — what does what](#13-file-map--what-does-what)

---

## 1. Accounts you need to create

Create these three free accounts before anything else:

| Service | URL | What it's for |
|---|---|---|
| GitHub | https://github.com | Stores your code |
| Supabase | https://supabase.com | Stores your guest list and RSVPs |
| Vercel | https://vercel.com | Hosts your live website |

> You already have GitHub set up (pbswimmer3). You just need Supabase and Vercel.

---

## 2. Local setup (run on your computer)

This lets you preview the site before it goes live.

**Prerequisites:** Install [Node.js](https://nodejs.org) (LTS version) if you haven't already.

```bash
# 1. Open a terminal in the project folder
cd "C:\Users\pradb\AI-Scripts\Engagement-Website"

# 2. Copy the environment variables template
cp .env.local.example .env.local

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Then open **http://localhost:3000** in your browser. The site updates live as you edit files.

> You'll need to fill in the Supabase keys in `.env.local` (step 3) before the RSVP page works locally.

---

## 3. Supabase setup (database)

### 3a. Create a project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **New project**
3. Give it a name (e.g. `engagement-website`), set a database password, choose a region
4. Wait ~2 minutes for it to provision

### 3b. Create the database table

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `supabase/schema.sql` from this project
4. Copy the entire contents and paste it into the SQL editor
5. Click **Run**

You should see a `guests` table appear under **Table Editor**.

### 3c. Add your guest list

**Option A — Table Editor (easiest):**
1. Click **Table Editor** → select the `guests` table
2. Click **Insert row** for each guest
3. Fill in: `first_name`, `last_name`, `email`
4. Leave `rsvp_status` as `pending`

**Option B — SQL Editor:**
```sql
insert into guests (first_name, last_name, email) values
  ('First', 'Last', 'email@example.com'),
  ('First', 'Last', 'email@example.com');
```

> The email you enter here is what guests must type to verify their identity on the RSVP page. Make sure it matches what they'd expect to use.

### 3d. Copy your API keys

1. In Supabase, go to **Settings** (gear icon) → **API**
2. Copy these three values:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | "Project URL" |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | "anon public" under Project API keys |
| `SUPABASE_SERVICE_ROLE_KEY` | "service_role" under Project API keys |

3. Open `.env.local` in this project and paste them in:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> `.env.local` is in your `.gitignore` — it will never be pushed to GitHub. Keep it private.

---

## 4. Vercel setup (live website)

### 4a. Create a Vercel account

1. Go to [vercel.com](https://vercel.com) and sign up **with your GitHub account** (pbswimmer3)

### 4b. Import your project

1. Click **Add New → Project**
2. Find `Engagement_Website` in the list and click **Import**
3. Leave all settings as default — Vercel detects Next.js automatically

### 4c. Add environment variables

Before clicking Deploy, scroll down to **Environment Variables** and add all three Supabase values:

```
NEXT_PUBLIC_SUPABASE_URL      = https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY     = eyJ...
```

### 4d. Deploy

Click **Deploy**. After ~2 minutes your site is live at a URL like:
```
https://engagement-website-pbswimmer3.vercel.app
```

Every time you push a change to GitHub, Vercel automatically rebuilds and redeploys.

---

## 5. Customising the site content

### Event details — Welcome page

Open `app/page.tsx` and update the `EVENT` block near the top:

```ts
const EVENT = {
  date: 'Saturday, 12th April 2025',
  time: '6:00 PM onwards',
  venue: 'The Grand Ballroom',
  address: '123 High Street, London, SW1A 1AA',
}
```

### Venue & travel info — Travel page

Open `app/travel/page.tsx` and update the `VENUE` block:

```ts
const VENUE = {
  name: 'The Grand Ballroom',
  address: '123 High Street, London, SW1A 1AA',
  parkingInfo: 'Free parking is available in the venue car park.',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=...', // see below
}
```

**How to get your Google Maps embed URL:**
1. Go to [maps.google.com](https://maps.google.com) and search for your venue
2. Click **Share** → **Embed a map**
3. Copy the `src="..."` value from the iframe code shown
4. Paste it as the `googleMapsEmbedUrl` above

Also update `TRAVEL_TIPS` in the same file with your by-car, by-train, and hotel info.

### FAQ answers

Open `app/faq/page.tsx` and edit the `FAQS` array. Each item has a `q` (question) and `a` (answer):

```ts
{
  q: 'What should I wear?',
  a: 'Smart casual or semi-formal attire is recommended.',
},
```

Add as many items as you like by copying the `{ q: ..., a: ... }` block pattern.

---

## 6. Adding and managing photos

### Adding photos

1. Copy your photo files into the `public/photos/` folder
2. Name them clearly, e.g. `photo-1.jpg`, `photo-2.jpg`, etc.
3. Open `components/PhotoGallery.tsx`
4. Update the `PHOTOS` array with your filenames:

```ts
const PHOTOS = [
  '/photos/photo-1.jpg',
  '/photos/photo-2.jpg',
  '/photos/photo-3.jpg',
  // add more here
]
```

The gallery auto-scrolls and loops infinitely. It looks best with **6–12 photos**.

### Supported formats
`.jpg` `.jpeg` `.png` `.webp`

### Tips
- Portrait/vertical photos (taller than wide) look best — the gallery frames are 224×288px
- If a photo file is missing, the slot shows a soft gradient placeholder — no error shown

---

## 7. Managing your guest list

All guest management is done in **Supabase → Table Editor → guests table**.

### Adding a guest
Click **Insert row**, fill in `first_name`, `last_name`, `email`. Leave `rsvp_status` as `pending`.

### Editing a guest
Click any cell in the table to edit it directly.

### Removing a guest
Select the row and click the delete (trash) icon.

### Importing many guests at once (CSV)
1. In Table Editor, click **Import data from CSV**
2. Your CSV should have columns: `first_name`, `last_name`, `email`

---

## 8. Viewing RSVP responses

1. Go to [supabase.com](https://supabase.com) → your project
2. Click **Table Editor** → `guests`
3. The `rsvp_status` column shows each guest's status:
   - `pending` — hasn't RSVPed yet
   - `attending` — coming
   - `not_attending` — can't make it

### Filtering
Click the **Filter** button to show only attending or only pending guests.

### Exporting responses
Click the **CSV** export button (top right of the table) to download the full list.

---

## 9. How to push changes live

After editing any file, run these three commands in the terminal:

```bash
# Stage the changed files
git add .

# Save a snapshot with a description
git commit -m "Update event details and photos"

# Send to GitHub → triggers automatic Vercel rebuild
git push origin main
```

Vercel will rebuild and redeploy automatically in ~2 minutes. You can watch the progress at [vercel.com](https://vercel.com) under your project's **Deployments** tab.

---

## 10. Custom domain (optional)

The site works perfectly on the free Vercel URL (`your-project.vercel.app`).

If you want a custom domain like `pradananya.com`:

1. Buy a domain from [Namecheap](https://namecheap.com) or [Porkbun](https://porkbun.com) (~$10–15/year)
2. In Vercel, go to your project → **Settings → Domains**
3. Click **Add**, type your domain, and follow the DNS instructions shown
4. Takes 10–30 minutes to go live

---

## 11. Password Protection

The site is protected by a password gate. Guests are redirected to `/password` before they can access any page.

**How it works:**
- `middleware.ts` at the project root intercepts all requests and checks for a `site-auth` cookie
- If the cookie is missing, the visitor is redirected to `/password`
- On the password page, the guest enters the password from their invitation
- The password is verified by `app/api/auth/route.ts` — if correct, a session cookie is set and the guest enters the site

**Setting the password:**
- The password is controlled by the `SITE_PASSWORD` environment variable
- It falls back to `Forever2026` if the variable is not set
- To change it locally: edit `.env.local` → `SITE_PASSWORD=YourPassword`
- To change it on Vercel: go to Project → Settings → Environment Variables → add/update `SITE_PASSWORD`

**Paths that bypass the gate (always public):**
- `/password` — the gate itself
- `/api/auth` — the password verification endpoint
- `/_next/`, `/assets/`, `/photos/` — static assets

**Cookie persistence:** By default the cookie is session-scoped (expires when the browser closes). To make guests stay logged in for 30 days, uncomment the `maxAge` line in `app/api/auth/route.ts`.

---

## 12. Background Image

A faint background texture is displayed behind all pages using a CSS pseudo-element.

**To swap the image:** Replace `public/assets/bg-main.jpg` with any JPEG, PNG, or WebP file (keep the same filename, or update the path in `app/globals.css`).

**To adjust the opacity:** In `app/globals.css`, find the `body::before` block and change the `opacity` value:
- `0.05` — nearly invisible
- `0.12` — current setting (subtle)
- `0.25` — clearly visible

**To remove it entirely:** Delete the `body::before` block in `app/globals.css`.

---

## 13. File map — what does what

```
Engagement-Website/
│
├── middleware.ts             ← Password gate (redirects unauthenticated visitors)
│
├── app/
│   ├── page.tsx              ← Welcome page (update EVENT details here)
│   ├── rsvp/page.tsx         ← RSVP page (3-step flow, no edits needed)
│   ├── travel/page.tsx       ← Travel page (update VENUE, HOTELS, AIRPORTS here)
│   ├── faq/page.tsx          ← FAQ page (update FAQS array here)
│   ├── layout.tsx            ← Shared layout, fonts, page title
│   ├── globals.css           ← Global styles, font scaling, background image
│   ├── password/
│   │   ├── layout.tsx        ← Bare layout for password page (no Navbar)
│   │   └── page.tsx          ← Styled password entry form
│   └── api/
│       ├── auth/route.ts     ← API: verifies site password, sets cookie
│       └── guests/
│           ├── search/route.ts   ← API: searches guest list by name
│           ├── verify/route.ts   ← API: checks guest email matches
│           └── rsvp/route.ts     ← API: saves RSVP status to database
│
├── components/
│   ├── Navbar.tsx            ← Top navigation bar
│   └── PhotoGallery.tsx      ← Auto-scrolling photo strip (update PHOTOS here)
│
├── lib/
│   └── supabase.ts           ← Supabase database client
│
├── public/
│   ├── assets/
│   │   └── bg-main.jpg       ← Background image (swap to change the texture)
│   └── photos/               ← Drop your photo files here
│
├── supabase/
│   └── schema.sql            ← Run this once in Supabase SQL Editor to set up DB
│
├── .env.local                ← Your private keys (never commit this)
├── .env.local.example        ← Template showing which keys are needed
└── tailwind.config.ts        ← Colour palette and fonts
```

---

## Quick reference — things you'll edit most often

| What to change | File to open |
|---|---|
| Date, time, venue name, address | `app/page.tsx` |
| Google Maps + travel directions | `app/travel/page.tsx` |
| FAQ questions and answers | `app/faq/page.tsx` |
| Photo list | `components/PhotoGallery.tsx` |
| Add/edit guests | Supabase → Table Editor |
| View RSVPs | Supabase → Table Editor |
