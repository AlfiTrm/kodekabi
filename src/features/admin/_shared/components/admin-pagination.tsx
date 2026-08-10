import Link from "next/link";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

function pageWindow(page: number, totalPages: number) {
  const start = Math.max(1, Math.min(page - 1, totalPages - 2));
  return Array.from({ length: Math.min(3, totalPages) }, (_, index) => start + index);
}

export function AdminPagination({ page, totalPages, buildHref }: AdminPaginationProps) {
  const pages = pageWindow(page, totalPages);
  const linkClass = "grid h-8 min-w-8 place-items-center rounded-lg border border-border-strong px-2 text-[10px] transition-colors hover:border-purple hover:text-white";
  const disabledClass = "grid h-8 min-w-8 cursor-not-allowed place-items-center rounded-lg border border-border px-2 text-[10px] text-foreground/25";

  return (
    <nav className="flex items-center gap-1.5" aria-label="Pagination">
      {page > 1 ? <Link href={buildHref(page - 1)} prefetch={false} scroll={false} className={linkClass}>Prev</Link> : <span className={disabledClass}>Prev</span>}
      {pages.map((item) => <Link key={item} href={buildHref(item)} prefetch={false} scroll={false} aria-current={item === page ? "page" : undefined} className={`${linkClass} ${item === page ? "border-purple bg-purple text-white" : "text-foreground/45"}`}>{item}</Link>)}
      {page < totalPages ? <Link href={buildHref(page + 1)} prefetch={false} scroll={false} className={linkClass}>Next</Link> : <span className={disabledClass}>Next</span>}
    </nav>
  );
}
