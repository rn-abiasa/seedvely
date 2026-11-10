import { useEffect, useState } from "react";
import { useInstall } from "../lib/useInstall";

const KEY = "seedvely:install-dismissed";
const SNOOZE_MS = 7 * 86400000;

const snoozed = () => {
  try {
    return Date.now() - Number(localStorage.getItem(KEY) || 0) < SNOOZE_MS;
  } catch {
    return false;
  }
};

export default function InstallNotice() {
  const { canInstall, iosHint, install } = useInstall();
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(snoozed);

  // muncul pelan setelah pengguna sempat melihat-lihat dulu
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 4000);
    return () => clearTimeout(t);
  }, []);

  if (hidden || !ready || !(canInstall || iosHint)) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {
      /* abaikan */
    }
    setHidden(true);
  };

  return (
    <div
      role="status"
      className="animate-pop fixed inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-40 mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-tub-edge/50 bg-card/90 p-3 pl-4 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md md:max-w-md"
    >
      <p className="min-w-0 flex-1 text-[13px] leading-snug">
        <span className="font-semibold">Pasang Seedvely</span>
        <span className="text-mute">
          {canInstall
            ? " di layar utama agar lebih cepat dan bisa dipakai offline."
            : " lewat Share → Add to Home Screen agar lebih cepat dan bisa dipakai offline."}
        </span>
      </p>
      {canInstall && (
        <button
          type="button"
          onClick={install}
          className="shrink-0 rounded-full bg-lime px-3.5 py-1.5 text-[13px] font-semibold text-on transition active:scale-95"
        >
          Pasang
        </button>
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Tutup"
        className="grid size-7 shrink-0 place-items-center rounded-full text-mute transition hover:bg-tub-edge/40"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
