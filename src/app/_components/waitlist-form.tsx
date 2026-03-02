"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const joinMutation = api.waitlist.join.useMutation({
    onMutate: () => setStatus("loading"),
    onSuccess: () => setStatus("success"),
    onError: () => setStatus("error"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    joinMutation.mutate({ email });
  };

  if (status === "success") {
    return (
      <div className="animate-in fade-in zoom-in mt-10 flex flex-col items-center duration-500">
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-4">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <p className="font-display text-lg font-bold text-emerald-900">
            Du bist auf der Liste! 🎉
          </p>
        </div>
        <p className="font-body mt-4 text-sm text-slate-400">
          Sichere dir deinen Platz
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="group relative flex items-center"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="deine@email.de"
          className="font-body w-full rounded-full border border-slate-200 bg-white/80 px-6 py-4 text-slate-900 backdrop-blur-md transition-all outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="absolute right-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-black active:scale-95 disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Warteliste beitreten"}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-2 text-center text-xs font-medium text-red-500">
          Fehler beim Eintragen. Versuche es später erneut.
        </p>
      )}

      <p className="mt-4 text-center text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
        Early Access sichern • Kostenlos
      </p>
    </div>
  );
}
