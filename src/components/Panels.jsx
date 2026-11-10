import { useRef, useState } from "react";
import Sheet from "./Sheet";
import { daysBetween } from "../lib/plants";

export const FILTERS = [
  { id: "all", label: "Semua", color: "bg-butter" },
  { id: "active", label: "Sedang tumbuh", color: "bg-lime" },
  { id: "done", label: "Sudah dipanen", color: "bg-lilac" },
];

export function HarvestSheet({ plants, onHarvest, onClose }) {
  const active = plants.filter((p) => !p.harvestedAt);
  return (
    <Sheet title="Panen hari ini" onClose={onClose}>
      {active.length === 0 ? (
        <p className="rounded-2xl bg-tub-edge/30 p-4 text-sm text-mute">
          Belum ada tanaman yang sedang tumbuh. Ketuk ikon skop untuk mulai menanam.
        </p>
      ) : (
        <ul className="space-y-2">
          {active.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-tub px-4 py-3 text-on">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-extrabold">{p.name}</p>
                <p className="text-xs opacity-70">
                  {p.batch} · hari ke-{daysBetween(p.sownAt)} · {p.qty} tanaman
                </p>
              </div>
              <button
                type="button"
                onClick={() => onHarvest(p.id)}
                className="rounded-full bg-coral px-3.5 py-1.5 text-sm font-semibold text-on transition active:scale-95"
              >
                Panen
              </button>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}

export function FilterSheet({ value, onPick, onClose }) {
  return (
    <Sheet title="Tampilkan" onClose={onClose}>
      <div className="flex flex-wrap gap-2.5">
        {FILTERS.map((f, i) => (
          <button
            key={f.id}
            type="button"
            onClick={() => (onPick(f.id), onClose())}
            aria-pressed={value === f.id}
            style={{ rotate: `${(i - 1) * 2}deg` }}
            className={`rounded-2xl px-4 py-2.5 text-sm font-semibold text-on transition active:scale-95 ${f.color} ${value === f.id ? "ring-2 ring-ink ring-offset-2 ring-offset-card" : "opacity-80"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </Sheet>
  );
}

export function DataSheet({ plants, onImport, onClose }) {
  const input = useRef(null);
  const [msg, setMsg] = useState("");

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(plants, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `gardenvely-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg(`${plants.length} data diekspor.`);
  };

  const importJson = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data)) throw new Error();
      const ids = new Set(plants.map((p) => p.id));
      const fresh = data.filter((p) => p && p.id && p.name && !ids.has(p.id));
      onImport(fresh);
      setMsg(`${fresh.length} data baru ditambahkan.`);
    } catch {
      setMsg("File tidak valid. Pilih file JSON hasil ekspor Gardenvely.");
    }
    e.target.value = "";
  };

  return (
    <Sheet title="Cadangan data" onClose={onClose}>
      <p className="mb-4 text-sm text-mute">
        Data tersimpan di browser ini saja. Ekspor secara berkala supaya aman kalau cache dibersihkan.
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        <button type="button" onClick={exportJson} className="rounded-2xl bg-sky py-3 text-sm font-semibold text-on transition active:scale-95">
          Ekspor
        </button>
        <button type="button" onClick={() => input.current?.click()} className="rounded-2xl bg-butter py-3 text-sm font-semibold text-on transition active:scale-95">
          Impor
        </button>
      </div>
      <input ref={input} type="file" accept="application/json,.json" className="hidden" onChange={importJson} />
      {msg && <p role="status" className="mt-4 text-sm font-medium">{msg}</p>}
    </Sheet>
  );
}
