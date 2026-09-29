"use client";
import { createContext, useContext } from "react";
export type Lang = "vi" | "en";
export const LangContext = createContext<Lang>("vi");
// Returns the current language and `t(vi, en)`, which picks the matching text.
export function useT() {
  const lang = useContext(LangContext);
  return {
    lang,
    t: <T,>(vi: T, en: T) => (lang === "en" ? en : vi),
    // Vietnamese uses a decimal comma; English uses a decimal point.
    num: (n: number, digits: number) => {
      const s = n.toFixed(digits);
      return lang === "en" ? s : s.replace(".", ",");
    },
  };
}
