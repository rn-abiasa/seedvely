import { memo } from "react";
import { daysBetween, fmtDate } from "../lib/plants";

const HOLES = 6;
const tilt = ["-0.8deg", "0.6deg", "-0.4deg", "0.9deg", "-0.6deg", "0.4deg"];

function Sprout({ type }) {
  return type === "buah" ? (
    <svg viewBox="0 0 40 40" className="animate-sprout w-[72%]" aria-hidden="true">
      <path d="M20 14c0-4 1-6 4-8" stroke="var(--leaf)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="25" r="9" fill="var(--coral)" />
      <path d="M15 17c3 1.5 7 1.5 10 0" stroke="var(--leaf)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  ) : (
    <svg viewBox="0 0 40 40" className="animate-sprout w-[72%]" aria-hidden="true">
      <path d="M20 36V20" stroke="var(--leaf)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 22C10 22 6 15 7 8c8 0 13 5 13 14z" fill="var(--leaf)" />
      <path d="M20 18c0-8 5-12 13-12 1 7-3 12-13 12z" fill="var(--lime)" />
    </svg>
  );
}

function Tub({ plant, index, onOpen }) {
  const done = !!plant.harvestedAt;
  const filled = done ? 0 : Math.min(plant.qty, HOLES);
  const extra = done ? 0 : Math.max(0, plant.qty - HOLES);
  const age = daysBetween(plant.sownAt, plant.harvestedAt || undefined);
  const isFruit = plant.type === "buah";

  return (
    <div style={{ rotate: tilt[index % tilt.length] }}>
      <button
        type="button"
        onClick={() => onOpen(plant)}
        style={{ animationDelay: `${index * 55}ms` }}
        className="animate-pop group relative block w-full text-left transition-transform duration-200 active:scale-[0.97] md:hover:-translate-y-1"
        aria-label={`${plant.name}, batch ${plant.batch}, ${done ? "sudah dipanen" : `hari ke-${age}`}`}
      >
        {/* tutup bak */}
        <div className="relative rounded-[1.25rem] bg-tub p-2.5 pt-4 shadow-[0_3px_0_var(--tub-edge),0_14px_20px_-14px_rgba(0,0,0,0.35)] sm:rounded-[1.5rem] sm:p-3.5 sm:pt-5">
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {Array.from({ length: HOLES }, (_, i) => (
              <span
                key={i}
                className="grid aspect-square place-items-end justify-items-center overflow-hidden rounded-full bg-hole shadow-[inset_0_0_0_4px_var(--ring),inset_0_5px_8px_rgba(0,0,0,0.5)]"
              >
                {i < filled && <Sprout type={plant.type} />}
              </span>
            ))}
          </div>
          <span className="absolute bottom-1.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-tub-edge" />
        </div>

        {/* badan bak */}
        <div className="mx-2 -mt-2 rounded-b-[1rem] border border-t-0 border-tub-edge/60 bg-card px-2.5 pb-2.5 pt-3.5 sm:mx-2.5 sm:rounded-b-[1.2rem] sm:px-3 sm:pb-3 sm:pt-4">
          <h3 className="truncate font-display text-sm font-extrabold leading-tight sm:text-lg">
            {plant.name}
          </h3>
          <p className="mt-0.5 text-[11px] text-mute sm:text-sm">
            {done
              ? `Panen ${fmtDate(plant.harvestedAt)} · ${age} hari`
              : `Hari ke-${age} · ${plant.transplantedAt ? `pindah ${fmtDate(plant.transplantedAt)}` : `semai ${fmtDate(plant.sownAt)}`}`}
          </p>
        </div>

        {/* stiker */}
        <span
          className={`absolute -left-1.5 -top-2.5 -rotate-6 rounded-full px-2 py-0.5 text-[11px] font-semibold sm:px-2.5 sm:py-1 sm:text-xs text-on shadow-sm ${isFruit ? "bg-coral" : "bg-lime"}`}
        >
          {isFruit ? "Buah" : "Sayuran"}
        </span>
        <span className="absolute -right-1 -top-2 rotate-3 rounded-md border border-dashed border-on/40 bg-butter px-1.5 py-0.5 text-[11px] font-semibold sm:px-2 sm:text-xs text-on shadow-sm">
          {plant.batch}
        </span>
        {extra > 0 && (
          <span className="absolute right-2 top-[42%] rotate-6 rounded-full bg-sky px-1.5 py-0.5 text-[11px] font-semibold sm:px-2 sm:text-xs text-on shadow-sm">
            +{extra}
          </span>
        )}
        {done && (
          <span className="stamp absolute right-1 top-[18%] flex size-14 rotate-12 items-center justify-center bg-lilac text-center font-display text-[11px] font-extrabold leading-tight text-on sm:size-[4.6rem] sm:text-sm">
            <span>
              Sudah
              <br />
              panen
            </span>
          </span>
        )}
      </button>
    </div>
  );
}

export default memo(Tub);
