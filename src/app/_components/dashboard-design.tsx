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

  const { mutate: updateProfileMutate } = api.profile.update.useMutation({
    onMutate: () => {
      const previousProfile = utils.profile.getMe.getData();
      return { saveId: saveCounterRef.current, previousProfile };
    },
    onSuccess: (_data, _variables, context) => {
      if (context?.saveId === saveCounterRef.current) {
        void utils.profile.getMe.invalidate();
      }
    },
    onError: (error, _variables, context) => {
      alert(`Fehler beim Speichern: ${error.message}`);
      if (
        context?.saveId === saveCounterRef.current &&
        context.previousProfile !== undefined
      ) {
        utils.profile.getMe.setData(undefined, context.previousProfile);
      }
    },
  });

  const currentTheme = deepMergeTheme(defaultTheme, profile?.theme);

  const applyOptimisticUpdate = (newTheme: ThemeConfig) => {
    utils.profile.getMe.setData(undefined, (old) => {
      if (!old) return old;
      return { ...old, theme: newTheme as ThemeConfig };
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
  const lastPendingThemeRef = useRef<ThemeConfig | null>(null);

  const saveTheme = useCallback(
    (newTheme: ThemeConfig) => {
      lastPendingThemeRef.current = newTheme;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveCounterRef.current += 1;

      saveTimeoutRef.current = setTimeout(() => {
        updateProfileMutate({
          theme: newTheme,
        });
        lastPendingThemeRef.current = null;
      }, 500);
    },
    [updateProfileMutate],
  );

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        if (lastPendingThemeRef.current) {
          updateProfileMutate({
            theme: lastPendingThemeRef.current,
          });
        }
      }
    };
  }, [updateProfileMutate]);

  return (
    <div className="space-y-8 pb-32">
      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="font-display text-xl font-bold">Generelles Design</h2>

        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <label
              htmlFor="theme-backgroundColor"
              className="text-sm font-bold text-slate-700"
            >
              Hintergrundfarbe
            </label>
            <input
              id="theme-backgroundColor"
              type="color"
              value={currentTheme.backgroundColor}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent p-0"
            />
          </div>

          <div className="flex items-center justify-between">
            <label
              htmlFor="theme-textColor"
              className="text-sm font-bold text-slate-700"
            >
              Textfarbe
            </label>
            <input
              id="theme-textColor"
              type="color"
              value={currentTheme.textColor}
              onChange={(e) => handleChange("textColor", e.target.value)}
              className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent p-0"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="theme-fontFamily"
              className="text-sm font-bold text-slate-700"
            >
              Schriftart
            </label>
            <select
              id="theme-fontFamily"
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
            <label
              htmlFor="button-backgroundColor"
              className="text-sm font-bold text-slate-700"
            >
              Button Farbe
            </label>
            <input
              id="button-backgroundColor"
              type="color"
              value={currentTheme.buttonStyle.backgroundColor}
              onChange={(e) =>
                handleButtonChange("backgroundColor", e.target.value)
              }
              className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent p-0"
            />
          </div>

          <div className="flex items-center justify-between">
            <label
              htmlFor="button-textColor"
              className="text-sm font-bold text-slate-700"
            >
              Button Textfarbe
            </label>
            <input
              id="button-textColor"
              type="color"
              value={currentTheme.buttonStyle.textColor}
              onChange={(e) => handleButtonChange("textColor", e.target.value)}
              className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent p-0"
            />
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="button-borderColor"
                className="text-sm font-bold text-slate-700"
              >
                Randfarbe
              </label>
              <input
                id="button-borderColor"
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
                <label
                  htmlFor="button-borderWidth"
                  className="text-sm font-bold text-slate-700"
                >
                  Randdicke
                </label>
                <span className="text-xs text-slate-500">
                  {currentTheme.buttonStyle.borderWidth}px
                </span>
              </div>
              <input
                id="button-borderWidth"
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
                <label
                  htmlFor="button-borderRadius"
                  className="text-sm font-bold text-slate-700"
                >
                  Abrundung (Radius)
                </label>
                <span className="text-xs text-slate-500">
                  {currentTheme.buttonStyle.borderRadius}px
                </span>
              </div>
              <input
                id="button-borderRadius"
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
              <label
                htmlFor="button-shadow"
                className="text-sm font-bold text-slate-700"
              >
                Schatten
              </label>
              <select
                id="button-shadow"
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
