import { movieController } from "@/src/controller/movie.contoller";
import { NextResponse } from "next/server";

// ✅ GET MOVIES (FIXED)
export async function GET(req: Request) {
  try {
    console.log("GET /api/movies called");

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const type = searchParams.get("type");

    console.log("TYPE:", type);
    console.log("SEARCH:", search);

    let movies;

    // ✅ filter by type
    if (type && type !== "All") {
      movies = await movieController.filterMovies(type);
    }
    // ✅ search
    else if (search) {
      movies = await movieController.searchMovies(search);
    }
    // ✅ default
    else {
      movies = await movieController.getMovies();
    }

    return NextResponse.json(movies);
  } catch (error) {
    console.error("GET /api/movies error:", error);

    return NextResponse.json(
      {
        message: "Server error",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

// ✅ CREATE MOVIE (KEEP THIS)
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // validate poster URL
    if (data.posterUrl) {
      try {
        new URL(String(data.posterUrl));
      } catch (err) {
        return NextResponse.json(
          { message: "Poster URL must be a valid URL" },
          { status: 400 }
        );
      }
    }

    const movie = await movieController.createMovie(data);

    return NextResponse.json(movie);
  } catch (error) {
    console.error("POST /api/movies error:", error);

    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}