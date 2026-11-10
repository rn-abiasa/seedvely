import { useState } from "react";
import Sheet from "./Sheet";
import { fmtDate, nextBatch, today } from "../lib/plants";

const inp =
  "w-full rounded-2xl border border-tub-edge/70 bg-tub px-3.5 py-2.5 text-base text-on outline-none transition focus:border-ink";

function Field({ id, label, action, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-mute">
          {label}
        </label>
        {action}
      </div>
      {children}
    </div>
  );
}

const TodayBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-xs font-semibold text-mute underline-offset-2 transition hover:text-ink hover:underline"
  >
    Hari ini
  </button>
);

export default function PlantForm({ plant, plants, onSave, onDelete, onClose }) {
  const editing = !!plant;
  const [f, setF] = useState(() =>
    plant
      ? {
          ...plant,
          transplantedAt: plant.transplantedAt || "",
          harvestedAt: plant.harvestedAt || "",
          notes: plant.notes || [],
        }
      : {
          name: "",
          type: "sayuran",
          batch: nextBatch(plants),
          sownAt: today(),
          transplantedAt: "",
          harvestedAt: "",
          qty: 6,
          notes: [],
        },
  );
  const [draft, setDraft] = useState("");
  const [sure, setSure] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const makeNote = (text) => ({ id: crypto.randomUUID(), at: today(), text });

  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    setF((s) => ({ ...s, notes: [makeNote(text), ...s.notes] }));
    setDraft("");
  };

  const removeNote = (id) =>
    setF((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) }));

  const submit = (e, close) => {
    e.preventDefault();
    if (!f.name.trim()) return;
    // catatan yang sudah diketik tapi belum ditekan "Tambah" tidak boleh hilang
    const text = draft.trim();
    onSave({
      ...f,
      name: f.name.trim(),
      batch: f.batch.trim() || "B1",
      qty: Math.max(1, Number(f.qty) || 1),
      transplantedAt: f.transplantedAt || null,
      harvestedAt: f.harvestedAt || null,
      notes: text ? [makeNote(text), ...f.notes] : f.notes,
    });
    close();
  };

  return (
    <Sheet title={editing ? "Detail tanaman" : "Tanam baru"} onClose={onClose}>
      {(close) => (
        <form onSubmit={(e) => submit(e, close)} className="space-y-4">
          <Field id="f-name" label="Nama tanaman">
            <input
              id="f-name"
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
            <Field id="f-batch" label="Batch">
              <input id="f-batch" className={inp} value={f.batch} onChange={(e) => set("batch", e.target.value)} />
            </Field>
            <Field id="f-qty" label="Jumlah">
              <div className="flex items-center gap-1.5">
                <button type="button" aria-label="Kurangi" onClick={() => set("qty", Math.max(1, Number(f.qty) - 1))} className="grid size-11 shrink-0 place-items-center rounded-2xl bg-tub-edge/40 text-lg font-semibold">−</button>
                <input id="f-qty" type="number" min="1" inputMode="numeric" className={`${inp} min-w-0 text-center`} value={f.qty} onChange={(e) => set("qty", e.target.value)} />
                <button type="button" aria-label="Tambah" onClick={() => set("qty", Number(f.qty) + 1)} className="grid size-11 shrink-0 place-items-center rounded-2xl bg-tub-edge/40 text-lg font-semibold">+</button>
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field id="f-sown" label="Tanggal semai">
              <input id="f-sown" type="date" className={inp} value={f.sownAt} max={today()} onChange={(e) => set("sownAt", e.target.value)} required />
            </Field>
            <Field
              id="f-transplant"
              label="Pindah tanam"
              action={!f.transplantedAt && <TodayBtn onClick={() => set("transplantedAt", today())} />}
            >
              <input id="f-transplant" type="date" className={inp} value={f.transplantedAt} min={f.sownAt} max={today()} onChange={(e) => set("transplantedAt", e.target.value)} />
            </Field>
          </div>

          {editing && (
            <Field
              id="f-harvest"
              label="Tanggal panen"
              action={!f.harvestedAt && <TodayBtn onClick={() => set("harvestedAt", today())} />}
            >
              <input id="f-harvest" type="date" className={inp} value={f.harvestedAt} min={f.transplantedAt || f.sownAt} max={today()} onChange={(e) => set("harvestedAt", e.target.value)} />
            </Field>
          )}

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="f-note" className="text-sm font-medium text-mute">
                Catatan
              </label>
              {f.notes.length > 0 && (
                <span className="text-xs text-mute">{f.notes.length} entri</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                id="f-note"
                className={`${inp} min-w-0 flex-1`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addNote();
                  }
                }}
                placeholder="Nutrisi, pH, kondisi daun…"
              />
              <button
                type="button"
                onClick={addNote}
                disabled={!draft.trim()}
                className="shrink-0 rounded-2xl bg-butter px-4 text-sm font-semibold text-on transition active:scale-95 disabled:opacity-40"
              >
                Tambah
              </button>
            </div>

            {f.notes.length > 0 && (
              <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto overscroll-contain">
                {f.notes.map((n) => (
                  <li key={n.id} className="flex items-start gap-3 rounded-2xl bg-tub px-3.5 py-2.5 text-on">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold opacity-60">{fmtDate(n.at)}</p>
                      <p className="break-words text-sm">{n.text}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNote(n.id)}
                      aria-label="Hapus catatan"
                      className="grid size-6 shrink-0 place-items-center rounded-full opacity-50 transition hover:opacity-100"
                    >
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            {editing && (
              <button
                type="button"
                onClick={() => (sure ? (onDelete(plant.id), close()) : setSure(true))}
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
      )}
    </Sheet>
  );
}
