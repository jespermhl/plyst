import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    // Der Haupt-Hintergrund der gesamten App
    <div className="font-body min-h-screen bg-slate-50">
      {/* 1. DIE NAVBAR */}
      <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-8">
        <div className="font-display text-xl font-black tracking-tighter text-slate-900">
          Plyst<span className="text-blue-600">.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500">Dashboard</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      {/* 2. DAS HAUPT-LAYOUT */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-10 p-6 lg:grid-cols-[1fr_400px]">
        {/* LINKE SPALTE: HIER PASSIERT DIE ARBEIT */}
        <div className="flex flex-col gap-8">
          {/* Header Bereich im Editor */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-900">
                Editor
              </h1>
              <p className="text-sm text-slate-500">
                Verwalte deine Links und Blöcke
              </p>
            </div>
            {/* Ein simpler Status-Indikator */}
            <div className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
              Live am Netz
            </div>
          </div>

          {/* DER "ADD BLOCK" BUTTON */}
          <button className="flex w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-4 font-semibold text-slate-400 transition-all hover:border-blue-400 hover:text-blue-600">
            + Neuen Block hinzufügen
          </button>

          {/* PLATZHALTER FÜR DIE BLÖCKE */}
          <div className="flex flex-col gap-4">
            {/* Hier bauen wir gleich die erste "Block-Komponente" */}
          </div>
        </div>

        {/* RECHTE SPALTE: DIE HANDY-PREVIEW */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col items-center">
            {/* Das Handy Gehäuse */}
            <div className="relative h-[680px] w-[340px] overflow-hidden rounded-[3rem] border-10 border-slate-900 bg-white shadow-2xl">
              {/* Die "Notch" des Handys */}
              <div className="absolute top-0 left-1/2 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900"></div>

              {/* Der tatsächliche Content im Handy */}
              <div className="h-full w-full p-4 pt-12">
                <div className="flex flex-col items-center">
                  <div className="mb-4 h-20 w-20 rounded-full bg-slate-100" />
                  <div className="mb-2 h-4 w-32 rounded-full bg-slate-100" />
                  <div className="h-2 w-20 rounded-full bg-slate-50" />
                </div>
              </div>
            </div>
            <p className="mt-6 text-[11px] font-medium tracking-widest text-slate-400 uppercase">
              Live Preview
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
