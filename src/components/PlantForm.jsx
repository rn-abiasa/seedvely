import { useState } from "react";
import Sheet from "./Sheet";
import { nextBatch, today } from "../lib/plants";

const inp =
  "w-full rounded-2xl border border-tub-edge/70 bg-tub px-3.5 py-2.5 text-base text-on outline-none transition focus:border-ink";

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-mute">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-mute">{hint}</span>}
    </label>
  );
}

export default function PlantForm({ plant, plants, onSave, onDelete, onClose }) {
  const editing = !!plant;
  const [f, setF] = useState(() =>
    plant
      ? { ...plant, harvestedAt: plant.harvestedAt || "" }
      : {
          name: "",
          type: "sayuran",
          batch: nextBatch(plants),
          sownAt: today(),
          harvestedAt: "",
          qty: 6,
          note: "",
        },
  );
  const [sure, setSure] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim()) return;
    onSave({
      ...f,
      name: f.name.trim(),
      batch: f.batch.trim() || "B1",
      qty: Math.max(1, Number(f.qty) || 1),
      harvestedAt: f.harvestedAt || null,
    });
    onClose();
  };

  return (
    <Sheet title={editing ? "Detail tanaman" : "Tanam baru"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nama tanaman">
          <input
            autoFocus={!editing}
            className={inp}
            value={f.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Contoh: Pakcoy"
            required
          />
        </Field>

        <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-tub-edge/30 p-1.5" role="radiogroup" aria-label="Jenis">
          {[
            ["sayuran", "Sayuran", "bg-lime"],
            ["buah", "Buah", "bg-coral"],
          ].map(([v, label, color]) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={f.type === v}
              onClick={() => set("type", v)}
              className={`rounded-xl py-2 text-sm font-semibold transition ${f.type === v ? `${color} text-on shadow-sm` : "text-mute"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Batch">
            <input className={inp} value={f.batch} onChange={(e) => set("batch", e.target.value)} />
          </Field>
          <Field label="Jumlah">
            <div className="flex items-center gap-1.5">
              <button type="button" aria-label="Kurangi" onClick={() => set("qty", Math.max(1, Number(f.qty) - 1))} className="grid size-11 shrink-0 place-items-center rounded-2xl bg-tub-edge/40 text-lg font-semibold">−</button>
              <input type="number" min="1" inputMode="numeric" className={`${inp} min-w-0 text-center`} value={f.qty} onChange={(e) => set("qty", e.target.value)} />
              <button type="button" aria-label="Tambah" onClick={() => set("qty", Number(f.qty) + 1)} className="grid size-11 shrink-0 place-items-center rounded-2xl bg-tub-edge/40 text-lg font-semibold">+</button>
            </div>
          </Field>
        </div>

        <div className={`grid gap-3 ${editing ? "grid-cols-2" : "grid-cols-1"}`}>
          <Field label="Tanggal semai">
            <input type="date" className={inp} value={f.sownAt} max={today()} onChange={(e) => set("sownAt", e.target.value)} required />
          </Field>
          {editing && (
            <Field label="Tanggal panen">
              <input type="date" className={inp} value={f.harvestedAt} min={f.sownAt} max={today()} onChange={(e) => set("harvestedAt", e.target.value)} />
            </Field>
          )}
        </div>

        <Field label="Catatan">
          <textarea
            rows={3}
            className={`${inp} resize-none`}
            value={f.note}
            onChange={(e) => set("note", e.target.value)}
            placeholder="Nutrisi, pH, kondisi daun…"
          />
        </Field>

        <div className="flex gap-2 pt-1">
          {editing && (
            <button
              type="button"
              onClick={() => (sure ? (onDelete(plant.id), onClose()) : setSure(true))}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${sure ? "bg-coral text-on" : "text-mute hover:bg-tub-edge/40"}`}
            >
              {sure ? "Yakin hapus?" : "Hapus"}
            </button>
          )}
          <button type="submit" className="flex-1 rounded-2xl bg-ink py-3 text-base font-semibold text-paper transition active:scale-[0.98]">
            {editing ? "Simpan perubahan" : "Tanam sekarang"}
          </button>
        </div>
      </form>
    </Sheet>
  );
}
