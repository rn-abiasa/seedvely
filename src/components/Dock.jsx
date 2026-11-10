import { Archive, Moon, Scissors, Shovel, Sliders, Sun, Tray } from "./Icons";
import { useTheme } from "../lib/useTheme";

const items = [
  { id: "plant", label: "Tanam", Icon: Shovel, color: "bg-lime" },
  { id: "harvest", label: "Panen", Icon: Scissors, color: "bg-coral" },
  { id: "storage", label: "Storage", Icon: Archive, color: "bg-butter" },
  { id: "filter", label: "Filter", Icon: Sliders, color: "bg-lilac" },
  { id: "data", label: "Cadangan", Icon: Tray, color: "bg-sky" },
  { id: "theme", label: "Tema", Icon: Tray, color: "bg-sky" },
];

export default function Dock({ onPick }) {
  const { theme, toggle } = useTheme();
  return (
    <nav
      aria-label="Aksi cepat"
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 mdbottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 right-auto -translate-x-1/2"
    >
      <div className="flex items-end gap-1.5 rounded-[1.4rem] border border-tub-edge/50 bg-card p-1.5 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.35)] md:gap-2 md:rounded-[1.7rem] md:p-2">
        {items.map(({ id, label, Icon: Base, color }) => {
          const isTheme = id === "theme";
          const Icon = isTheme ? (theme === "dark" ? Sun : Moon) : Base;
          const text = isTheme ? (theme === "dark" ? "Mode terang" : "Mode gelap") : label;
          return (
            <button
              key={id}
              type="button"
              data-label={text}
              aria-label={text}
              onClick={() => (isTheme ? toggle() : onPick(id))}
              className={`dock-item grid size-10 place-items-center rounded-xl text-on md:size-12 md:rounded-2xl ${color}`}
            >
              <Icon className="size-5 md:size-6" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
