import { useCallback, useEffect, useState } from "react";

const KEY = "seedvely:theme";
const COLORS = { light: "#eef2ea", dark: "#111915" };

const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
const current = () =>
  document.documentElement.dataset.theme || (systemDark() ? "dark" : "light");

const apply = (t) => {
  document.documentElement.dataset.theme = t;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.removeAttribute("media");
    m.setAttribute("content", COLORS[t]);
  });
};

export function useTheme() {
  const [theme, setTheme] = useState(current);

  // pilihan manual yang tersimpan juga harus menyamakan warna bar browser
  useEffect(() => {
    if (document.documentElement.dataset.theme) apply(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    const next = current() === "dark" ? "light" : "dark";
    apply(next);
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* abaikan */
    }
  }, []);

  return { theme, toggle };
}
