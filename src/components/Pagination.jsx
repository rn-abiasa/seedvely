import { Chevron } from "./Icons";

const range = (page, pages) => {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = new Set([1, pages, page - 1, page, page + 1]);
  const out = [];
  [...set]
    .filter((n) => n >= 1 && n <= pages)
    .sort((a, b) => a - b)
    .forEach((n, i, arr) => {
      if (i && n - arr[i - 1] > 1) out.push("…" + n);
      out.push(n);
    });
  return out;
};

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const arrow =
    "grid size-9 place-items-center rounded-full text-ink transition hover:bg-tub-edge/40 disabled:opacity-30 disabled:hover:bg-transparent md:size-10";

  return (
    <nav aria-label="Halaman" className="mt-8 flex items-center justify-center gap-0.5 md:mt-10 md:gap-1">
      <button type="button" className={arrow} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Halaman sebelumnya">
        <Chevron dir="left" className="size-5" />
      </button>
      {range(page, pages).map((n) =>
        typeof n === "string" ? (
          <span key={n} className="px-1 text-mute" aria-hidden="true">…</span>
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={`grid size-9 place-items-center rounded-full font-display text-sm font-extrabold transition md:size-10 md:text-base ${n === page ? "-rotate-6 bg-lilac text-on shadow-sm" : "text-mute hover:bg-tub-edge/40"}`}
          >
            {n}
          </button>
        ),
      )}
      <button type="button" className={arrow} disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Halaman berikutnya">
        <Chevron className="size-5" />
      </button>
    </nav>
  );
}
