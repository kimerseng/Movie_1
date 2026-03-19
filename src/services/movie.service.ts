import { pool } from "@/src/lib/db";

export const movieService = {

  // Get all movies
  async getMovies() {
    const result = await pool.query(
      "SELECT * FROM movie ORDER BY id DESC"
    );
    return result.rows;
  },

  // Search movies
  async searchMovies(search: string) {
    if (!search) {
      const result = await pool.query(
        "SELECT * FROM movie ORDER BY id DESC"
      );
      return result.rows;
    }

    const result = await pool.query(
      `SELECT * FROM movie
       WHERE LOWER(title) LIKE LOWER($1)
       ORDER BY id DESC`,
      [`%${search}%`]
    );

    return result.rows;
  },

  // Create movie
  async createMovie(data: any) {
    const { title, duration, type, subtitle, videoUrl } = data;
    // accept either poster or posterUrl from client
    const poster = data.poster ?? data.posterUrl ?? null;

    const result = await pool.query(
      `INSERT INTO movie (title, duration, type, subtitle, "videoUrl", poster)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [title, duration, type, subtitle, videoUrl, poster]
    );

    return result.rows[0];
  },

  // Update movie
  async updateMovie(id: string | number, data: any) {
    const { title, duration, type, subtitle, videoUrl } = data;
    const poster = data.poster ?? data.posterUrl ?? null;

  if (!id) throw new Error("Movie ID is missing");

    const result = await pool.query(
      `UPDATE movie
       SET title=$1,
           duration=$2,
           type=$3,
           subtitle=$4,
           "videoUrl"=$5,
           poster=$6
       WHERE id=$7
       RETURNING *`,
      [title, duration, type, subtitle, videoUrl, poster, id]
    );

    if (result.rows.length === 0) {
      throw new Error(`Movie with id=${id} not found`);
    }

    return result.rows[0];
  },

  // Filter movies by type
  async filterMovies(type: string) {
    const result = await pool.query(
      `SELECT * FROM movie WHERE type = $1 ORDER BY id DESC`,
      [type]
    );
    return result.rows;
  },

  // Delete movie
  async deleteMovie(id: string | number) {
    await pool.query("DELETE FROM movie WHERE id=$1", [id]);
  },

};
