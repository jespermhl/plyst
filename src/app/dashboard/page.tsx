"use client";

import { api } from "~/trpc/react";

export default function DashboardPage() {
  const utils = api.useUtils();

  const { data: blocks, isLoading } = api.block.getAll.useQuery();

  const addBlock = api.block.add.useMutation({
    onSuccess: () => {
      void utils.block.getAll.invalidate();
    },
  });

  return (
    <div className="font-body min-h-screen bg-[#fafafa] text-slate-900">
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-12 p-6 lg:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight">
              Editor
            </h1>
            <p className="mt-2 text-slate-500">
              Erstelle und verwalte deine Profil-Blöcke.
            </p>
          </div>

          <button
            onClick={() => addBlock.mutate({ type: "link" })}
            disabled={addBlock.isPending}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 p-6 transition-all hover:border-blue-400 hover:bg-blue-50/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <span className="text-2xl">+</span>
            </div>
            <span className="font-bold text-slate-400 group-hover:text-blue-600">
              {addBlock.isPending
                ? "Wird erstellt..."
                : "Neuen Link hinzufügen"}
            </span>
          </button>

          <div className="flex flex-col gap-4">
            {isLoading && (
              <p className="py-10 text-center text-slate-400">
                Lade deine Blöcke...
              </p>
            )}

            {blocks?.map((block) => (
              <div
                key={block.id}
                className="group relative flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                  {block.type}
                </div>

                <div className="space-y-2">
                  <input
                    className="font-display w-full text-xl font-bold outline-none placeholder:text-slate-200"
                    defaultValue={block.title ?? ""}
                    placeholder="Titel des Links"
                  />
                  <input
                    className="font-body w-full text-sm text-slate-400 outline-none placeholder:text-slate-200"
                    defaultValue={block.url ?? ""}
                    placeholder="https://deine-url.de"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col items-center">
            <div className="relative h-[680px] w-[340px] overflow-hidden rounded-[3rem] border-10 border-slate-900 bg-white shadow-2xl">
              <div className="absolute top-0 left-1/2 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900"></div>

              <div className="h-full w-full p-6 pt-16 text-center">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-slate-100" />
                <div className="mx-auto mb-2 h-4 w-32 rounded-full bg-slate-100" />

                <div className="mt-10 space-y-3">
                  {blocks?.map((block) => (
                    <div
                      key={block.id}
                      className="w-full rounded-xl border border-slate-100 py-3 text-sm font-bold shadow-sm"
                    >
                      {block.title || "Unbenannt"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-6 text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
              Live Preview
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
