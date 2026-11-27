import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="my-4 text-sm text-[#625973]">
      <ol className="flex flex-wrap items-center gap-1 sm:gap-2">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-full border-2 border-[#2b2140] bg-white font-medium text-[#2b2140] shadow-[3px_3px_0_rgba(43,33,64,0.2)] transition-colors hover:bg-[#ffd23f]"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="inline-flex items-center gap-1 sm:gap-2">
              <ChevronRight className="h-4 w-4 shrink-0 text-[#625973]" />
              {isLast ? (
                <span className="max-w-[200px] truncate font-bold text-[#2b2140] sm:max-w-xs" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="max-w-[150px] truncate font-medium text-[#514461] underline-offset-2 transition-colors hover:text-[#2b2140] hover:underline sm:max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
