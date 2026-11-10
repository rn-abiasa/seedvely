import { useCallback, useEffect, useState } from "react";

const KEY = "gardenvely:plants:v1";

export const today = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

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

const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
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
    let added = 0;
    setPlants((list) => {
      const ids = new Set(list.map((p) => p.id));
      const fresh = incoming.filter((p) => p && p.id && p.name && !ids.has(p.id));
      added = fresh.length;
      return [...list, ...fresh];
    });
    return added;
  }, []);

  return { plants, save, remove, harvest, importMany };
}
