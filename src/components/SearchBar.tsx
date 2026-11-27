"use client";

import { useState, useRef, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Sparkles, ArrowRight } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  initialQuery?: string;
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
  initialQuery = "",
  className = "",
  size = "md",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    categories: [],
    pages: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsId = useId();

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

        if (!controller.signal.aborted) {
          setResults({
            categories: data.categories ?? [],
            pages: data.pages ?? [],
          });
        }
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
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
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
        className="relative w-full min-w-0"
      >
        <Search
          className={`absolute top-1/2 -translate-y-1/2 text-[#625973] pointer-events-none ${iconSizes[size]}`}
        />

        <input
          type="search"
          aria-label="Search coloring pages"
          aria-expanded={isOpen && Boolean(query.trim())}
          aria-controls={suggestionsId}
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setResults({ categories: [], pages: [] });
            setIsOpen(true);
          }}
          onKeyDown={event => { if (event.key === "Escape") setIsOpen(false); }}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className={`w-full max-w-full rounded-full border-2 border-[#2b2140] bg-white text-[#2b2140] placeholder-[#756a7b] shadow-[3px_3px_0_rgba(43,33,64,0.2)] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#2b2140] transition-all ${sizeClasses[size]}`}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[#625973] hover:bg-[#fff3d6] hover:text-[#2b2140]"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Auto-suggestions dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div id={suggestionsId} className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain rounded-2xl border-2 border-[#2b2140] bg-white shadow-[6px_6px_0_rgba(43,33,64,0.2)] animate-in fade-in slide-in-from-top-2 duration-150">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-[#625973]" role="status">
              Searching...
            </div>
          ) : !hasResults ? (
            <div className="p-4 text-center text-sm text-[#625973]">
              No direct matches for &ldquo;{query}&rdquo;. Press Enter to
              search all coloring pages.
            </div>
          ) : (
            <div className="py-2 divide-y divide-slate-100">
              {/* Category Suggestions */}
              {matchedCategories.length > 0 && (
                <div className="px-3 py-2">
                  <span className="mb-1 block px-2 text-xs font-semibold uppercase tracking-wider text-[#625973]">
                    Categories
                  </span>

                  {matchedCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/coloring-pages/${cat.slug}/`}
                      onClick={() => setIsOpen(false)}
                      className="flex min-h-11 items-center justify-between rounded-lg px-3 py-2 text-sm text-[#2b2140] transition-colors hover:bg-[#fff3d6]"
                    >
                      <span className="font-medium">
                        {cat.name}
                      </span>

                      <span className="rounded-full bg-[#e8f4ff] px-2 py-0.5 text-xs font-sans text-[#2b2140]">
                        Category
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Coloring Page Suggestions */}
              {matchedPages.length > 0 && (
                <div className="px-3 py-2">
                  <span className="mb-1 block px-2 text-xs font-semibold uppercase tracking-wider text-[#625973]">
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
                      className="group flex min-h-11 items-center justify-between rounded-lg px-3 py-2 text-sm text-[#2b2140] transition-colors hover:bg-[#fff3d6]"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Sparkles className="h-4 w-4 shrink-0 text-[#8b5cf6]" />

                        <span className="font-medium truncate">
                          {page.title}
                        </span>
                      </div>

                      <ArrowRight className="h-4 w-4 shrink-0 text-[#625973] transition-colors group-hover:text-[#2b2140]" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Full Search Action */}
              <div className="bg-[#fff3d6] p-2 text-center">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="flex min-h-11 w-full items-center justify-center gap-1 py-1 text-xs font-semibold text-[#2b2140] hover:underline"
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