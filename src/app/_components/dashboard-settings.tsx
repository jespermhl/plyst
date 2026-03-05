"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { api } from "~/trpc/react";
import { useEffect, useRef, useState } from "react";

function AvatarUpload() {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("Die Datei ist zu groß. Maximal 2MB.");
      return;
    }

    try {
      if (!user) {
        alert("Du bist nicht angemeldet. Bitte Seite neu laden.");
        return;
      }
      setIsUploading(true);
      await user.setProfileImage({ file });
      alert("Profilbild aktualisiert!");
    } catch (err) {
      console.error(err);
      alert("Fehler beim Upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="font-display text-left text-xl font-bold text-slate-900">
        Profilbild
      </h2>
      <div className="mt-6 flex items-center gap-6">
        <div className="group relative">
          <img
            src={user?.imageUrl}
            className={`h-24 w-24 rounded-full border-4 border-slate-50 object-cover shadow-sm transition-opacity ${
              isUploading ? "opacity-50" : "opacity-100"
            }`}
            alt="Profil"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 text-left">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
          >
            Bild hochladen
          </button>
          <p className="text-[10px] font-medium text-slate-400">
            JPG, PNG oder GIF. Max. 2MB.
          </p>
        </div>
      </div>
    </section>
  );
}

export function DashboardSettingsPanel() {
  const { isLoaded } = useUser();
  const utils = api.useUtils();
  const { openUserProfile } = useClerk();

  const { data: profile } = api.profile.getMe.useQuery();
  const updateProfile = api.profile.update.useMutation({
    onSuccess: () => {
      void utils.profile.getMe.invalidate();
      alert("Gespeichert!");
    },
    onError: (error) => {
      alert(`Fehler beim Speichern: ${error.message}`);
    },
  });

  const [draft, setDraft] = useState<{
    displayName: string;
    bio: string;
  } | null>(null);
  const displayName = draft?.displayName ?? profile?.displayName ?? "";
  const bio = draft?.bio ?? profile?.bio ?? "";

  if (!isLoaded) return null;

  return (
    <div className="space-y-8">
      <AvatarUpload />

      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="font-display text-xl font-bold">Öffentliches Profil</h2>
        <div className="mt-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">
              Anzeigename
            </label>
            <input
              className="w-full rounded-2xl bg-slate-50 px-5 py-3 outline-none focus:ring-2 focus:ring-blue-100"
              value={displayName}
              maxLength={20}
              onChange={(e) =>
                setDraft((prev) => ({
                  displayName: e.target.value,
                  bio: prev?.bio ?? profile?.bio ?? "",
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">
              Bio
            </label>
            <textarea
              className="w-full rounded-2xl bg-slate-50 px-5 py-3 outline-none focus:ring-2 focus:ring-blue-100"
              value={bio}
              maxLength={100}
              onChange={(e) =>
                setDraft((prev) => ({
                  displayName: prev?.displayName ?? profile?.displayName ?? "",
                  bio: e.target.value,
                }))
              }
              rows={2}
            />
          </div>
          <button
            onClick={() =>
              updateProfile.mutate({
                displayName:
                  displayName.trim() === "" ? undefined : displayName.trim(),
                bio,
              })
            }
            disabled={updateProfile.isPending}
            className="rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            {updateProfile.isPending ? "Wird gespeichert..." : "Speichern"}
          </button>
        </div>
      </section>

      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="font-display text-xl font-bold">Sicherheit</h2>
        <div className="mt-6 space-y-4">
          <div className="transition-hover flex items-center justify-between rounded-2xl bg-slate-50 p-5 hover:bg-slate-100/50">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">
                Account-Sicherheit
              </p>
              <p className="font-medium text-slate-700">
                E-Mail, Passwort & 2FA
              </p>
            </div>
            <button
              onClick={() => openUserProfile()}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50"
            >
              Verwalten
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
