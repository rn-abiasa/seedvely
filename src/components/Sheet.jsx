import { useEffect } from "react";

export default function Sheet({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div
        className="animate-fade absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-sheet relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[1.75rem] bg-card p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl md:max-w-md md:rounded-[2rem] md:p-5 md:pb-6"
      >
        <span className="mx-auto mb-4 block h-1.5 w-10 rounded-full bg-tub-edge md:hidden" />
        <div className="mb-4 flex items-center justify-between md:mb-5">
          <h2 className="font-display text-xl font-extrabold md:text-2xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="grid size-9 place-items-center rounded-full text-mute transition hover:bg-tub-edge/40"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
