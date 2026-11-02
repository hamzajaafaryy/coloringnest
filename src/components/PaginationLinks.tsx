import Link from "next/link";
import { pageUrl } from "@/lib/paging";

export default function PaginationLinks({ path, page, pageCount, query }: {
  path: string; page: number; pageCount: number; query?: string;
}) {
  if (pageCount <= 1) return null;
  return <nav aria-label="Browse coloring page results" className="mt-9 flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
    {page > 1 && <Link rel="prev" href={pageUrl(path, page - 1, query)} className="rounded-xl border border-violet-200 bg-white px-4 py-3 text-violet-800">← Previous</Link>}
    <span className="rounded-xl bg-violet-50 px-4 py-3 text-violet-900">Page {page} of {pageCount}</span>
    {page < pageCount && <Link rel="next" href={pageUrl(path, page + 1, query)} className="rounded-xl border border-violet-200 bg-white px-4 py-3 text-violet-800">Next →</Link>}
  </nav>;
}
