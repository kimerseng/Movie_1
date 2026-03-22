# Fix PostgreSQL Connection Error in Production

## Steps:
- [x] 1. Create TODO.md with plan breakdown  
- [x] 2. Update src/lib/db.ts with connection validation and better error handling
- [x] 3. Create .env.example with production DATABASE_URL template
- [ ] 4. Set DATABASE_URL in deployment platform dashboard (Vercel/Railway/etc.) to production Postgres URL (e.g., Neon/Supabase) - NO localhost:5432
- [ ] 5. Redeploy the application  
- [ ] 6. Test API: curl https://your-app.vercel.app/api/movies
- [ ] 7. Mark complete

**Instructions:**
1. Get free Postgres: Neon.tech or Supabase.com (5min setup)
2. Copy connection string to platform env vars
3. Redeploy and test
