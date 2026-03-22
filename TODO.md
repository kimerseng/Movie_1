# Fix Vercel Deployment & Data Creation

## Completed
- [x] next.config.js → default .next (Vercel OK)
- [x] Local npm run build ✓
- [x] Committed changes

## Fix "can't create data" on Vercel
**Root Cause:** No DATABASE_URL env var + DB table missing.

**Steps:**
- [ ] 1. Vercel Dashboard → Project → Settings → Environment Variables
  ```
  DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
  ```
  (Get from Neon/Supabase/ Railway – copy your local .env)

- [ ] 2. Create table (psql/pgAdmin/Vercel Postgres):
```sql
CREATE TABLE IF NOT EXISTS movie (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  duration TEXT,
  type TEXT,
  subtitle TEXT,
  "videoUrl" TEXT,
  poster TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- [ ] 3. Git push: `git push --set-upstream origin main`

- [ ] 4. Test: your-vercel-app.vercel.app/admin → Add movie

**Note:** Uses pg directly (not Prisma). Code logic correct – form posterUrl maps to DB poster.

