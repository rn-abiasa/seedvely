import { Moon, Sun } from "./Icons";
import { useTheme } from "../lib/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      className="grid size-10 shrink-0 place-items-center rounded-full border border-tub-edge/50 bg-card text-ink transition active:scale-90"
    >
      <span key={theme} className="animate-pop grid place-items-center">
        {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </span>
    </button>
  );
}
