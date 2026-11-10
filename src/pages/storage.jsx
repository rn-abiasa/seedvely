import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "../components/Icons";
import Pagination from "../components/Pagination";
import PlantForm from "../components/PlantForm";
import ThemeToggle from "../components/ThemeToggle";
import { daysBetween, fmtDate, usePlants } from "../lib/plants";

const PER_PAGE = 6;
const TYPES = [
  ["all", "Semua"],
  ["sayuran", "Sayuran"],
  ["buah", "Buah"],
];

function Entry({ plant: p, index, onOpen }) {
  const days = daysBetween(p.sownAt, p.harvestedAt);
  const last = p.notes[0];
  const isFruit = p.type === "buah";
  const steps = [
    ["Semai", p.sownAt, "bg-lime"],
    ["Pindah", p.transplantedAt, "bg-sky"],
    ["Panen", p.harvestedAt, "bg-coral"],
  ];

  return (
    <button
      type="button"
      onClick={() => onOpen(p)}
      style={{ animationDelay: `${index * 45}ms` }}
      className="animate-pop w-full rounded-3xl border border-tub-edge/50 bg-card p-4 text-left transition active:scale-[0.98] md:hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-extrabold">{p.name}</h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px] font-semibold">
            <span className={`rounded-full px-2 py-0.5 text-on ${isFruit ? "bg-coral" : "bg-lime"}`}>
              {isFruit ? "Buah" : "Sayuran"}
            </span>
            <span className="rounded-md bg-butter px-1.5 py-0.5 text-on">{p.batch}</span>
            <span className="rounded-full bg-tub-edge/40 px-2 py-0.5 text-mute">{p.qty} tanaman</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-3xl font-extrabold leading-none">{days}</p>
          <p className="mt-0.5 text-[11px] text-mute">hari</p>
        </div>
      </div>

      <ol className="relative mt-5 grid grid-cols-3 before:absolute before:inset-x-[16.6%] before:top-[5px] before:h-px before:bg-tub-edge">
        {steps.map(([label, date, color]) => (
          <li key={label} className="relative flex flex-col items-center text-center">
            <span
              className={`size-[11px] rounded-full ${date ? color : "border border-tub-edge bg-card"}`}
            />
            <span className="mt-1.5 text-[11px] text-mute">{label}</span>
            <span className="text-xs font-semibold">{date ? fmtDate(date) : "—"}</span>
          </li>
        ))}
      </ol>

      {last && (
        <p className="mt-4 truncate rounded-xl bg-tub-edge/25 px-3 py-1.5 text-xs text-mute">
          “{last.text}”{p.notes.length > 1 && ` · +${p.notes.length - 1} catatan`}
        </p>
      )}
    </button>
  );
}

export default function Storage() {
  const { plants, save, remove } = usePlants();
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(null);

  const harvested = useMemo(() => plants.filter((p) => p.harvestedAt), [plants]);

  const stats = useMemo(() => {
    const n = harvested.length;
    const totalQty = harvested.reduce((s, p) => s + p.qty, 0);
    const avg = n
      ? Math.round(
          harvested.reduce((s, p) => s + daysBetween(p.sownAt, p.harvestedAt), 0) / n,
        )
      : 0;
    return { n, totalQty, avg };
  }, [harvested]);

  const list = useMemo(
    () =>
      harvested
        .filter((p) => type === "all" || p.type === type)
        .sort(
          (a, b) =>
            b.harvestedAt.localeCompare(a.harvestedAt) || b.createdAt - a.createdAt,
        ),
    [harvested, type],
  );

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = list.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const goPage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto min-h-dvh max-w-4xl px-4 pb-16 pt-[max(1.5rem,env(safe-area-inset-top))] md:px-5 md:pt-14">
      <header className="mb-7 flex items-center justify-between gap-4 md:mb-9">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            viewTransition
            aria-label="Kembali ke kebun"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-tub-edge/50 bg-card transition active:scale-90"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
              Storage
            </h1>
            <p className="mt-0.5 text-[13px] text-mute md:text-base">
              {stats.n === 0 ? "Hasil panen akan tersimpan di sini." : `${stats.n} batch sudah dipanen`}
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {stats.n > 0 && (
        <>
          <div className="mb-6 grid grid-cols-3 gap-2.5 md:gap-4">
            {[
              ["Batch", stats.n, "bg-lime", "-1deg"],
              ["Tanaman", stats.totalQty, "bg-butter", "0.8deg"],
              ["Rata-rata hari", stats.avg, "bg-sky", "-0.5deg"],
            ].map(([label, value, color, rotate]) => (
              <div
                key={label}
                style={{ rotate }}
                className={`rounded-2xl p-3 text-on md:p-4 ${color}`}
              >
                <p className="font-display text-2xl font-extrabold leading-none md:text-4xl">
                  {value}
                </p>
                <p className="mt-1.5 text-[11px] font-medium opacity-70 md:text-sm">{label}</p>
              </div>
            ))}
          </div>

          <div
            className="mb-5 grid grid-cols-3 gap-1.5 rounded-2xl bg-tub-edge/30 p-1.5 md:max-w-xs"
            role="radiogroup"
            aria-label="Jenis tanaman"
          >
            {TYPES.map(([v, label]) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={type === v}
                onClick={() => (setType(v), setPage(1))}
                className={`rounded-xl py-1.5 text-sm font-semibold transition ${type === v ? "bg-card shadow-sm" : "text-mute"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      <main>
        {visible.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 md:gap-4">
            {visible.map((p, i) => (
              <Entry key={p.id} plant={p} index={i} onOpen={setOpen} />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-xs text-center">
            <p className="font-display text-xl font-extrabold">
              {stats.n === 0 ? "Belum ada panen" : "Tidak ada yang cocok"}
            </p>
            <p className="mt-1 text-sm text-mute">
              {stats.n === 0
                ? "Tandai tanaman sebagai panen dari halaman kebun, nanti riwayatnya muncul di sini."
                : "Ganti filter jenis untuk melihat panen lainnya."}
            </p>
            {stats.n === 0 && (
              <Link
                to="/"
                viewTransition
                className="mt-4 inline-block rounded-full bg-lime px-4 py-2 text-sm font-semibold text-on transition active:scale-95"
              >
                Kembali ke kebun
              </Link>
            )}
          </div>
        )}

        <Pagination page={current} pages={pages} onChange={goPage} />
      </main>

      {open && (
        <PlantForm
          key={open.id}
          plant={open}
          plants={plants}
          onSave={save}
          onDelete={remove}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
