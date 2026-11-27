import Link from "next/link";
import { pageUrl } from "@/lib/paging";

export default function PaginationLinks({ path, page, pageCount, query }: {
  path: string; page: number; pageCount: number; query?: string;
}) {
  if (pageCount <= 1) return null;
  return <nav aria-label="Browse coloring page results" className="mt-9 flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
    {page > 1 && <Link rel="prev" href={pageUrl(path, page - 1, query)} className="inline-flex min-h-12 items-center rounded-full border-2 border-[#2b2140] bg-white px-5 py-3 text-[#2b2140] shadow-[4px_4px_0_#2b2140] transition hover:-translate-y-0.5 hover:bg-[#fff3d6]">← Previous</Link>}
    <span aria-current="page" className="inline-flex min-h-12 items-center rounded-full border-2 border-[#2b2140] bg-[#ffd23f] px-5 py-3 text-[#2b2140] shadow-[4px_4px_0_#2b2140]">Page {page} of {pageCount}</span>
    {page < pageCount && <Link rel="next" href={pageUrl(path, page + 1, query)} className="inline-flex min-h-12 items-center rounded-full border-2 border-[#2b2140] bg-white px-5 py-3 text-[#2b2140] shadow-[4px_4px_0_#2b2140] transition hover:-translate-y-0.5 hover:bg-[#fff3d6]">Next →</Link>}
  </nav>;
}
