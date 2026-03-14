"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "~/trpc/react";
import {
  type ThemeConfig,
  defaultTheme,
  FONT_OPTIONS,
  deepMergeTheme,
} from "~/lib/theme";

export function DashboardDesignPanel() {
  const { data: profile } = api.profile.getMe.useQuery();
  const utils = api.useUtils();
  const saveCounterRef = useRef(0);

  const updateProfile = api.profile.update.useMutation({
    onMutate: () => {
      return { saveId: saveCounterRef.current };
    },
    onSuccess: (data, variables, context) => {
      if (context?.saveId === saveCounterRef.current) {
        void utils.profile.getMe.invalidate();
      }
    },
    onError: (error) => {
      alert(`Fehler beim Speichern: ${error.message}`);
    },
  });

  const currentTheme = deepMergeTheme(defaultTheme, profile?.theme);

  const applyOptimisticUpdate = (newTheme: ThemeConfig) => {
    utils.profile.getMe.setData(undefined, (old) => {
      if (!old) return old;
      return { ...old, theme: newTheme as any };
    });
  };

  const handleChange = <K extends keyof ThemeConfig>(
    key: K,
    value: ThemeConfig[K],
  ) => {
    const newTheme = { ...currentTheme, [key]: value };
    applyOptimisticUpdate(newTheme);
    saveTheme(newTheme);
  };

  const handleButtonChange = (
    key: keyof ThemeConfig["buttonStyle"],
    value: string | number,
  ) => {
    const newTheme = {
      ...currentTheme,
      buttonStyle: { ...currentTheme.buttonStyle, [key]: value },
    };
    applyOptimisticUpdate(newTheme);
    saveTheme(newTheme);
  };

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveTheme = useCallback(
    (newTheme: ThemeConfig) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveCounterRef.current += 1;

      saveTimeoutRef.current = setTimeout(() => {
        updateProfile.mutate({
          theme: newTheme,
        });
      }, 500);
    },
    [updateProfile],
  );

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-8 pb-32">
      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="font-display text-xl font-bold">Generelles Design</h2>

        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-700">
              Hintergrundfarbe
            </label>
            <input
              type="color"
              value={currentTheme.backgroundColor}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent p-0"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-700">
              Textfarbe
            </label>
            <input
              type="color"
              value={currentTheme.textColor}
              onChange={(e) => handleChange("textColor", e.target.value)}
              className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent p-0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Schriftart
            </label>
            <select
              value={currentTheme.fontFamily}
              onChange={(e) => handleChange("fontFamily", e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 outline-none focus:ring-2 focus:ring-blue-100"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="font-display text-xl font-bold">Button-Design</h2>

        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-700">
              Button Farbe
            </label>
            <input
              type="color"
              value={currentTheme.buttonStyle.backgroundColor}
              onChange={(e) =>
                handleButtonChange("backgroundColor", e.target.value)
              }
              className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent p-0"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-700">
              Button Textfarbe
            </label>
            <input
              type="color"
              value={currentTheme.buttonStyle.textColor}
              onChange={(e) => handleButtonChange("textColor", e.target.value)}
              className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent p-0"
            />
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">
                Randfarbe
              </label>
              <input
                type="color"
                value={currentTheme.buttonStyle.borderColor}
                onChange={(e) =>
                  handleButtonChange("borderColor", e.target.value)
                }
                className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-slate-700">
                  Randdicke
                </label>
                <span className="text-xs text-slate-500">
                  {currentTheme.buttonStyle.borderWidth}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={currentTheme.buttonStyle.borderWidth}
                onChange={(e) =>
                  handleButtonChange("borderWidth", parseInt(e.target.value))
                }
                className="w-full accent-slate-900"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-slate-700">
                  Abrundung (Radius)
                </label>
                <span className="text-xs text-slate-500">
                  {currentTheme.buttonStyle.borderRadius}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={currentTheme.buttonStyle.borderRadius}
                onChange={(e) =>
                  handleButtonChange("borderRadius", parseInt(e.target.value))
                }
                className="w-full accent-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Schatten
              </label>
              <select
                value={currentTheme.buttonStyle.shadow}
                onChange={(e) => handleButtonChange("shadow", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="none">Kein Schatten</option>
                <option value="sm">Dezent (sm)</option>
                <option value="md">Mittel (md)</option>
                <option value="lg">Groß (lg)</option>
                <option value="xl">Besonders (xl)</option>
              </select>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
