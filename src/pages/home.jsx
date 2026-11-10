import { useState } from "react";
import Dock from "../components/Dock";
import InstallNotice from "../components/InstallNotice";
import Pagination from "../components/Pagination";
import PlantForm from "../components/PlantForm";
import Tub from "../components/Tub";
import {
  DataSheet,
  FILTERS,
  FilterSheet,
  HarvestSheet,
} from "../components/Panels";
import { usePlants } from "../lib/plants";

const PER_PAGE = 6;

export default function Home() {
  const { plants, save, remove, harvest, importMany } = usePlants();
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [ui, setUi] = useState(null);

  const growing = plants.filter((p) => !p.harvestedAt).length;
  const harvested = plants.length - growing;

  const list = plants
    .filter((p) =>
      filter === "all"
        ? true
        : filter === "active"
          ? !p.harvestedAt
          : !!p.harvestedAt,
    )
    .sort((a, b) => b.createdAt - a.createdAt);

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = list.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const close = () => setUi(null);

  const pick = (id) => {
    if (id === "plant") setUi({ kind: "form" });
    else setUi({ kind: id });
  };

  return (
    <div className="mx-auto min-h-dvh max-w-4xl px-4 pb-32 pt-[max(1.5rem,env(safe-area-inset-top))] md:px-5 md:pb-40 md:pt-14">
      <header className="mb-7 flex items-end justify-between gap-4 md:mb-9">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            Seedvely
          </h1>
          <p className="mt-1 text-[13px] text-mute md:mt-1.5 md:text-base">
            {plants.length === 0
              ? "Kebun hidroponikmu masih kosong."
              : `${growing} sedang tumbuh, ${harvested} sudah dipanen`}
          </p>
        </div>
        {filter !== "all" && (
          <button
            type="button"
            onClick={() => (setFilter("all"), setPage(1))}
            className="-rotate-2 rounded-full bg-lilac px-3 py-1.5 text-xs font-semibold text-on shadow-sm"
          >
            {FILTERS.find((f) => f.id === filter).label} ✕
          </button>
        )}
      </header>

      <main>
        {visible.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 md:grid-cols-3 md:gap-x-6 md:gap-y-9">
            {visible.map((p, i) => (
              <Tub
                key={p.id}
                plant={p}
                index={i}
                onOpen={(plant) => setUi({ kind: "form", plant })}
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-xs text-center">
            <div className="mx-auto mb-5 grid w-40 grid-cols-3 gap-2 rounded-[1.5rem] bg-tub p-3 shadow-[0_3px_0_var(--tub-edge)]">
              {Array.from({ length: 6 }, (_, i) => (
                <span
                  key={i}
                  className="aspect-square rounded-full bg-hole shadow-[inset_0_0_0_4px_var(--ring)]"
                />
              ))}
            </div>
            <p className="font-display text-xl font-extrabold">
              {plants.length === 0
                ? "Belum ada yang ditanam"
                : "Tidak ada yang cocok"}
            </p>
            <p className="mt-1 text-sm text-mute">
              {plants.length === 0
                ? "Ketuk ikon skop di bawah untuk mencatat tanaman pertamamu."
                : "Ganti filter untuk melihat tanaman lainnya."}
            </p>
          </div>
        )}

        <Pagination page={current} pages={pages} onChange={setPage} />
      </main>

      <Dock onPick={pick} />
      <InstallNotice />

      {ui?.kind === "form" && (
        <PlantForm
          key={ui.plant?.id || "new"}
          plant={ui.plant}
          plants={plants}
          onSave={save}
          onDelete={remove}
          onClose={close}
        />
      )}
      {ui?.kind === "harvest" && (
        <HarvestSheet plants={plants} onHarvest={harvest} onClose={close} />
      )}
      {ui?.kind === "filter" && (
        <FilterSheet
          value={filter}
          onPick={(f) => (setFilter(f), setPage(1))}
          onClose={close}
        />
      )}
      {ui?.kind === "data" && (
        <DataSheet plants={plants} onImport={importMany} onClose={close} />
      )}
    </div>
  );
}
