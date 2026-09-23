// src/lib/tailwindMap.ts

export const FONT_SIZES = [
  { label: "Sm", value: "text-sm", desc: "14px (0.875rem)" },
  { label: "Base", value: "text-base", desc: "16px (1rem)" },
  { label: "Lg", value: "text-lg", desc: "18px (1.125rem)" },
  { label: "Xl", value: "text-xl", desc: "20px (1.25rem)" },
  { label: "2Xl", value: "text-2xl", desc: "24px (1.5rem)" },
  { label: "3Xl", value: "text-3xl", desc: "30px (1.875rem)" },
  { label: "4Xl", value: "text-4xl", desc: "36px (2.25rem)" },
];

export const FONT_WEIGHTS: Record<string, string> = {
  Regular: "font-normal",
  Semibold: "font-semibold",
  Extrabold: "font-extrabold",
};

export const TEXT_ALIGNS = ["left", "center", "right"] as const;

export const MARGIN_BOTTOM_MAP: Record<number, string> = {
  0: "mb-0",
  2: "mb-2",
  4: "mb-4",
  6: "mb-6",
  8: "mb-8",
  10: "mb-10",
  12: "mb-12",
};