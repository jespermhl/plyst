import { z } from "zod";

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

export const ThemeConfigSchema = z.object({
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  fontFamily: z.string().optional(),
  buttonStyle: z
    .object({
      backgroundColor: z.string().optional(),
      textColor: z.string().optional(),
      borderColor: z.string().optional(),
      borderWidth: z.number().optional(),
      borderRadius: z.number().optional(),
      shadow: z.string().optional(),
    })
    .optional(),
});

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

export function deepMergeTheme(
  base: ThemeConfig,
  overrideUnknown?: unknown,
): ThemeConfig {
  if (!overrideUnknown || typeof overrideUnknown !== "object") return base;
  const override = overrideUnknown as Record<string, unknown>;
  const overrideBtn = (
    override.buttonStyle && typeof override.buttonStyle === "object"
      ? override.buttonStyle
      : {}
  ) as Record<string, unknown>;

  return {
    ...base,
    backgroundColor:
      typeof override.backgroundColor === "string"
        ? override.backgroundColor
        : base.backgroundColor,
    textColor:
      typeof override.textColor === "string"
        ? override.textColor
        : base.textColor,
    fontFamily:
      typeof override.fontFamily === "string" &&
      FONT_OPTIONS.includes(override.fontFamily)
        ? override.fontFamily
        : base.fontFamily,
    buttonStyle: {
      ...base.buttonStyle,
      backgroundColor:
        typeof overrideBtn.backgroundColor === "string"
          ? overrideBtn.backgroundColor
          : base.buttonStyle.backgroundColor,
      textColor:
        typeof overrideBtn.textColor === "string"
          ? overrideBtn.textColor
          : base.buttonStyle.textColor,
      borderColor:
        typeof overrideBtn.borderColor === "string"
          ? overrideBtn.borderColor
          : base.buttonStyle.borderColor,
      borderWidth:
        typeof overrideBtn.borderWidth === "number"
          ? overrideBtn.borderWidth
          : base.buttonStyle.borderWidth,
      borderRadius:
        typeof overrideBtn.borderRadius === "number"
          ? overrideBtn.borderRadius
          : base.buttonStyle.borderRadius,
      shadow:
        typeof overrideBtn.shadow === "string"
          ? overrideBtn.shadow
          : base.buttonStyle.shadow,
    },
  };
}
