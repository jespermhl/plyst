"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

export type ThemeConfig = {
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  buttonStyle: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    shadow: string;
  };
};

export const defaultTheme: ThemeConfig = {
  backgroundColor: "#fafafa",
  textColor: "#0f172a",
  fontFamily: "Inter",
  buttonStyle: {
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    borderColor: "#f1f5f9",
    borderWidth: 1,
    borderRadius: 24,
    shadow: "sm",
  },
};

export const FONT_OPTIONS = [
  "Inter",
  "Roboto",
  "Playfair Display",
  "Montserrat",
  "Lora",
  "Oswald",
  "Raleway",
  "Poppins",
];

export function DashboardDesignPanel() {
  const { data: profile } = api.profile.getMe.useQuery();
  const utils = api.useUtils();

  const updateProfile = api.profile.update.useMutation({
    onSuccess: () => {
      void utils.profile.getMe.invalidate();
    },
    onError: (error) => {
      alert(`Fehler beim Speichern: ${error.message}`);
    },
  });

  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  useEffect(() => {
    if (profile?.theme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme({ ...defaultTheme, ...(profile.theme as Partial<ThemeConfig>) });
    }
  }, [profile?.theme]);

  const handleChange = <K extends keyof ThemeConfig>(
    key: K,
    value: ThemeConfig[K],
  ) => {
    const newTheme = { ...theme, [key]: value };
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const handleButtonChange = (
    key: keyof ThemeConfig["buttonStyle"],
    value: string | number,
  ) => {
    const newTheme = {
      ...theme,
      buttonStyle: { ...theme.buttonStyle, [key]: value },
    };
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  // Debounced save
  const saveTheme = (newTheme: ThemeConfig) => {
    updateProfile.mutate({
      theme: newTheme,
    });
  };

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
              value={theme.backgroundColor}
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
              value={theme.textColor}
              onChange={(e) => handleChange("textColor", e.target.value)}
              className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent p-0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Schriftart
            </label>
            <select
              value={theme.fontFamily}
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
              value={theme.buttonStyle.backgroundColor}
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
              value={theme.buttonStyle.textColor}
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
                value={theme.buttonStyle.borderColor}
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
                  {theme.buttonStyle.borderWidth}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={theme.buttonStyle.borderWidth}
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
                  {theme.buttonStyle.borderRadius}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={theme.buttonStyle.borderRadius}
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
                value={theme.buttonStyle.shadow}
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
