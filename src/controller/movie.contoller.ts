import { movieService } from "@/src/services/movie.service";

function normalizeMovie(row: any) {
  if (!row) return row;
  // prefer posterUrl if already present, otherwise map poster -> posterUrl
  return {
    ...row,
    posterUrl: row.posterUrl ?? row.poster ?? null,
  };
}

export const movieController = {

  async getMovies() {
    const rows = await movieService.getMovies();
    return rows.map((r: any) => normalizeMovie(r));
  },

  async searchMovies(search: string) {
    const rows = await movieService.searchMovies(search);
    return rows.map((r: any) => normalizeMovie(r));
  },

  async filterMovies(type: string) {
    const rows = await movieService.filterMovies(type);
    return rows.map((r: any) => normalizeMovie(r));
  },

  async createMovie(data: any) {
    const row = await movieService.createMovie(data);
    return normalizeMovie(row);
  },

  async updateMovie(id: string | number, data: any) {
    const row = await movieService.updateMovie(id, data);
    return normalizeMovie(row);
  },

  async deleteMovie(id: string | number) {
    return await movieService.deleteMovie(id);
  },

};
