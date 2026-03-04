"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function OnboardingPage() {
  const [handle, setHandle] = useState("");
  const [debouncedHandle, setDebouncedHandle] = useState("");
  const router = useRouter();

  // Wartet 500ms nach dem Tippen, um die DB nicht zu stressen
  useEffect(() => {
    const timer = setTimeout(() => {
      if (handle.length >= 2) setDebouncedHandle(handle);
    }, 500);
    return () => clearTimeout(timer);
  }, [handle]);

  // tRPC: Prüfen ob Name frei ist
  const { data: checkData, isLoading } = api.profile.checkHandle.useQuery(
    { handle: debouncedHandle },
    { enabled: debouncedHandle.length >= 2 },
  );

  // tRPC: Profil final erstellen
  const createProfile = api.profile.create.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (err) => {
      alert("Fehler: " + err.message);
    },
  });

  const isAvailable = checkData?.isAvailable && debouncedHandle.length >= 2;

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,#fff_100%)] bg-size-[4rem_4rem]"></div>

          <div className="w-full max-w-2xl text-center">
            <h2 className="font-body mb-16 text-xs font-bold tracking-[0.3em] text-slate-400 uppercase">
              Sichere dir deine URL
            </h2>

            <div className="font-display flex flex-wrap items-center justify-center text-center text-5xl font-bold tracking-tighter md:text-6xl">
              <span className="text-slate-200">plyst.cc/</span>
              <input
                autoFocus
                type="text"
                placeholder="name"
                value={handle}
                onChange={(e) =>
                  setHandle(
                    e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""),
                  )
                }
                className="inline-block w-auto min-w-[100px] bg-transparent text-slate-900 outline-none placeholder:text-slate-100"
                style={{ width: `${Math.max(handle.length || 4, 1)}ch` }}
              />
            </div>

            <div className="mt-12 h-6">
              {isLoading && handle !== debouncedHandle && (
                <p className="text-xs font-bold tracking-widest text-slate-300 uppercase">
                  Prüfe Verfügbarkeit...
                </p>
              )}
              {!isLoading && debouncedHandle.length >= 2 && (
                <p
                  className={`text-xs font-bold tracking-widest uppercase ${isAvailable ? "text-emerald-500" : "text-red-500"}`}
                >
                  {isAvailable
                    ? "✓ Dieser Name ist noch frei"
                    : "✕ Dieser Name ist bereits vergeben"}
                </p>
              )}
            </div>

            <button
              disabled={!isAvailable || createProfile.isPending}
              onClick={() =>
                createProfile.mutate({
                  handle: debouncedHandle,
                  displayName: debouncedHandle,
                })
              }
              className="mt-16 rounded-full bg-slate-900 px-12 py-5 text-xl font-bold text-white shadow-2xl shadow-slate-200 transition-all hover:bg-black active:scale-95 disabled:opacity-5"
            >
              {createProfile.isPending
                ? "Wird gesichert..."
                : "Meinen Account erstellen"}
            </button>

            <p className="font-body mt-8 text-sm text-slate-400">
              Keine Sorge, du kannst deinen Anzeigenamen später jederzeit
              ändern.
            </p>
          </div>
        </main>
      </SignedIn>
    </>
  );
}
