'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import MovieSection from "@/src/components/MovieSection";
import Footer from "@/src/components/Footer";
import { MOVIE_TYPES } from "@/src/constants";

async function getMovies(search?: string, type?: string) {
  try {
    let url = "/api/movies";
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (type && type !== "All") params.set("type", type);

    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch movies");

    const movies = await res.json();
    return Array.isArray(movies) ? movies : [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

export default function Home() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialType = searchParams.get("type") || "All";

  const [search, setSearch] = useState(initialSearch);
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [movies, setMovies] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);

  // Fetch movies on search/type change
  useEffect(() => {
    const fetchData = async () => {
      const data = await getMovies(
        search || undefined,
        typeFilter === "All" ? undefined : typeFilter
      );
      setMovies(data);
      setVisibleCount(8);
    };
    fetchData();
  }, [search, typeFilter]);

  // Search handler
  const handleSearch = (query: string) => {
    setSearch(query);

    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (typeFilter !== "All") params.set("type", typeFilter);

    const newUrl = params.toString() ? `/?${params.toString()}` : "/";
    window.history.pushState({}, "", newUrl);
  };

  // Type filter handler
  const handleTypeFilter = (newType: string) => {
    setTypeFilter(newType);

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (newType !== "All") params.set("type", newType);

    const newUrl = params.toString() ? `/?${params.toString()}` : "/";
    window.history.pushState({}, "", newUrl);
  };

  // Load more
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const visibleMovies = movies.slice(0, visibleCount);
  const hasMore = movies.length > visibleMovies.length;

  return (
    <div className="min-h-screen font-sans bg-black text-white selection:bg-[#e5a00d] selection:text-black">
      <Navbar onSearch={handleSearch} initialQuery={search} />

      <main className="p-4 max-w-[1400px] mx-auto">

        {/* FILTER BUTTONS */}
        <div className="mb-8">
          <h2 className="text-sm text-zinc-400 mb-3">Filter by Type</h2>
          <div className="flex flex-wrap gap-3">
            {["All", ...MOVIE_TYPES].map((t) => (
              <button
                key={t}
                onClick={() => handleTypeFilter(t)}
                className={`px-5 py-2 rounded-full border transition-all duration-200
                  ${
                    typeFilter === t
                      ? "bg-[#e5a00d] text-black font-semibold shadow-lg scale-105"
                      : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* NO MOVIES FOUND */}
        {movies.length === 0 && (
          <div className="text-center py-20 text-zinc-400">
            <h2 className="text-xl font-semibold mb-2">No Movies Found 😢</h2>
            <p>
              {typeFilter !== "All"
                ? `No movies found for "${typeFilter}"`
                : search
                ? `No result for "${search}"`
                : "No movies available"}
            </p>
          </div>
        )}

        {/* MOVIE SECTION */}
        {movies.length > 0 && (
          <MovieSection
            title={
              typeFilter !== "All"
                ? `${typeFilter} Movies${search ? ` - "${search}"` : ""}`
                : search
                ? `Search Result for "${search}"`
                : "Movies To Watch Right Now"
            }
            movies={visibleMovies}
            type="video"
          />
        )}

        {/* LOAD MORE BUTTON */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-[#e5a00d] text-black font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-[#e5a00d]/20"
            >
              Load More
            </button>
          </div>
        )}
        <Footer />
      </main>
    </div>
  );
}