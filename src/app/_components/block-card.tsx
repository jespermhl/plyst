"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

export function BlockCard({ block }: { block: any }) {
  const utils = api.useUtils();
  const [title, setTitle] = useState(block.title ?? "");
  const [url, setUrl] = useState(block.url ?? "");

  const update = api.block.update.useMutation({
    onSuccess: () => void utils.block.getAll.invalidate(),
  });

  const remove = api.block.delete.useMutation({
    onMutate: async (deletedBlock) => {
      await utils.block.getAll.cancel();

      const previousBlocks = utils.block.getAll.getData();

      utils.block.getAll.setData(undefined, (old) =>
        old?.filter((b) => b.id !== deletedBlock.id),
      );

      return { previousBlocks };
    },

    onError: (err, deletedBlock, context) => {
      if (context?.previousBlocks) {
        utils.block.getAll.setData(undefined, context.previousBlocks);
      }
      alert("Fehler beim Löschen. Bitte versuchs nochmal.");
    },

    onSettled: () => {
      void utils.block.getAll.invalidate();
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== block.title || url !== block.url) {
        update.mutate({ id: block.id, title, url });
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [title, url, block.id]);

  return (
    <div className="group relative flex flex-col gap-5 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
          <span className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
            {block.type}
          </span>
        </div>

        <button
          onClick={() => remove.mutate({ id: block.id })}
          className="rounded-full p-2 text-slate-300 transition-all hover:bg-red-50 hover:text-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <input
            className="font-display w-full text-xl font-bold text-slate-800 outline-none placeholder:text-slate-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel des Links"
          />
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 transition-colors focus-within:bg-blue-50/50">
          <svg
            className="text-slate-300"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <input
            className="font-body w-full bg-transparent text-sm font-medium text-slate-500 outline-none placeholder:text-slate-300"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://deine-url.de"
          />
        </div>
      </div>

      <div
        className={`absolute right-8 -bottom-2 transition-all duration-300 ${update.isPending ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
      >
        <div className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 shadow-sm">
          <div className="h-1 w-1 animate-bounce rounded-full bg-blue-500" />
          <span className="text-[10px] font-bold text-blue-600">Autosave</span>
        </div>
      </div>
    </div>
  );
}
