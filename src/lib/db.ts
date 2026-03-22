// import { Pool } from "pg";

// export const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "movie_db",
//   password: "movie1234",
//   port: 5432,
// });
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config(); // load environment variables

let pool: Pool;

try {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Test connection on init
  pool.query("SELECT 1").catch(async (err) => {
    console.error("Database connection failed:", err.message);
    console.error("Check DATABASE_URL - should NOT be localhost in production");
    await pool.end();
    throw err;
  });

} catch (error) {
  console.error("Failed to create database pool:", error);
  pool = {
    query: async () => {
      throw new Error(
        "Database connection unavailable. " +
        "In production: Set DATABASE_URL in platform dashboard (Vercel/Netlify/etc.) to production Postgres (Neon/Supabase). " +
        "Local: Use postgres://localhost:5432/movie_db in .env"
      );
    },
  } as any;
}

export { pool };
