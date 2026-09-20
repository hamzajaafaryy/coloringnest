"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Sparkles, ArrowRight } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface SearchCategory {
  id: number;
  name: string;
  slug: string | null;
}

interface SearchPage {
  id: number;
  title: string;
  slug: string | null;
  categorySlug: string | null;
}

interface SearchResults {
  categories: SearchCategory[];
  pages: SearchPage[];
}

export default function SearchBar({
  placeholder = "Search free coloring pages...",
  className = "",
  size = "md",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    categories: [],
    pages: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // DB search with debounce
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const data: SearchResults = await response.json();

        setResults({
          categories: data.categories ?? [],
          pages: data.pages ?? [],
        });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("SearchBar error:", error);

        setResults({
          categories: [],
          pages: [],
        });
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = query.trim();

    if (!trimmed) return;

    setIsOpen(false);

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    setResults({
      categories: [],
      pages: [],
    });
  };

  const matchedCategories = results.categories;
  const matchedPages = results.pages;

  const hasResults =
    matchedCategories.length > 0 || matchedPages.length > 0;

  const sizeClasses = {
    sm: "py-1.5 pl-9 pr-8 text-sm",
    md: "py-2.5 pl-10 pr-10 text-base",
    lg: "py-3.5 pl-12 pr-12 text-lg font-medium shadow-sm",
  };

  const iconSizes = {
    sm: "w-4 h-4 left-3",
    md: "w-5 h-5 left-3.5",
    lg: "w-6 h-6 left-4",
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
    >
      <form
        onSubmit={handleSearchSubmit}
        className="relative w-full"
      >
        <Search
          className={`absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${iconSizes[size]}`}
        />

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className={`w-full rounded-full border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${sizeClasses[size]}`}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Auto-suggestions dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-slate-500">
              Searching...
            </div>
          ) : !hasResults ? (
            <div className="p-4 text-center text-sm text-slate-500">
              No direct matches for &ldquo;{query}&rdquo;. Press Enter to
              search all coloring pages.
            </div>
          ) : (
            <div className="py-2 divide-y divide-slate-100">
              {/* Category Suggestions */}
              {matchedCategories.length > 0 && (
                <div className="px-3 py-2">
                  <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase px-2 mb-1 block">
                    Categories
                  </span>

                  {matchedCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/coloring-pages/${cat.slug}/`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors"
                    >
                      <span className="font-medium">
                        {cat.name}
                      </span>

                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-sans">
                        Category
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Coloring Page Suggestions */}
              {matchedPages.length > 0 && (
                <div className="px-3 py-2">
                  <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase px-2 mb-1 block">
                    Coloring Pages
                  </span>

                  {matchedPages.map((page) => (
                    <Link
                      key={page.id}
                      href={
                        page.categorySlug && page.slug
                          ? `/coloring-pages/${page.categorySlug}/${page.slug}/`
                          : "/coloring-pages/"
                      }
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />

                        <span className="font-medium truncate">
                          {page.title}
                        </span>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Full Search Action */}
              <div className="p-2 bg-slate-50 text-center">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full text-xs font-semibold text-indigo-600 hover:text-indigo-800 py-1 flex items-center justify-center gap-1"
                >
                  View all results for &ldquo;{query}&rdquo;
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}