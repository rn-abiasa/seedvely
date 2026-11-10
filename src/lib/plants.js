import { useCallback, useEffect, useState } from "react";

const KEY = "gardenvely:plants:v1";

const pad = (n) => String(n).padStart(2, "0");

export const toISODate = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const today = () => toISODate(new Date());

export const daysBetween = (a, b = today()) =>
  Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000));

export const fmtDate = (s) =>
  s
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(
        new Date(s),
      )
    : "";

export const nextBatch = (plants) => {
  const nums = plants
    .map((p) => parseInt(String(p.batch).replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  return `B${nums.length ? Math.max(...nums) + 1 : 1}`;
};

const dateOr = (s) =>
  typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s))
    ? s
    : null;

/**
 * Merapikan satu data tanaman. Dipakai saat memuat dan saat impor, jadi data lama
 * (satu kolom `note`) otomatis menjadi riwayat `notes`, dan data impor yang
 * tidak lengkap tidak merusak tampilan.
 */
export const normalize = (p) => {
  const createdAt = Number(p.createdAt) || Date.now();
  const created = toISODate(new Date(createdAt));

  let notes = [];
  if (Array.isArray(p.notes)) {
    notes = p.notes
      .filter((n) => n && n.text)
      .map((n) => ({
        id: n.id || crypto.randomUUID(),
        at: dateOr(n.at) || created,
        text: String(n.text),
      }));
  } else if (p.note) {
    notes = [{ id: crypto.randomUUID(), at: created, text: String(p.note) }];
  }

  const out = {
    ...p,
    name: String(p.name || "").trim(),
    type: p.type === "buah" ? "buah" : "sayuran",
    batch: String(p.batch || "B1"),
    qty: Math.max(1, Number(p.qty) || 1),
    sownAt: dateOr(p.sownAt) || created,
    transplantedAt: dateOr(p.transplantedAt),
    harvestedAt: dateOr(p.harvestedAt),
    createdAt,
    notes,
  };
  delete out.note;
  return out;
};

const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data.filter((p) => p && p.id).map(normalize) : [];
  } catch {
    return [];
  }
};

export function usePlants() {
  const [plants, setPlants] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(plants));
    } catch {
      /* penyimpanan penuh atau diblokir */
    }
  }, [plants]);

  const save = useCallback((data) => {
    setPlants((list) =>
      data.id
        ? list.map((p) => (p.id === data.id ? { ...p, ...data } : p))
        : [{ ...data, id: crypto.randomUUID(), createdAt: Date.now() }, ...list],
    );
  }, []);

  const remove = useCallback(
    (id) => setPlants((list) => list.filter((p) => p.id !== id)),
    [],
  );

  const harvest = useCallback(
    (id) =>
      setPlants((list) =>
        list.map((p) => (p.id === id ? { ...p, harvestedAt: today() } : p)),
      ),
    [],
  );

  const importMany = useCallback((incoming) => {
    setPlants((list) => {
      const ids = new Set(list.map((p) => p.id));
      const fresh = incoming
        .filter((p) => p && p.id && p.name && !ids.has(p.id))
        .map(normalize);
      return [...list, ...fresh];
    });
  }, []);

  return { plants, save, remove, harvest, importMany };
}
