"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type Settings,
} from "./settings";

type Ctx = {
  settings: Settings;
  setSettings: (next: Settings | ((prev: Settings) => Settings)) => void;
  reset: () => void;
};

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const hasHydrated = useRef(false);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    setSettingsState(loadSettings());
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    if (saveTimer.current !== null) {
      window.clearTimeout(saveTimer.current);
    }
    saveTimer.current = window.setTimeout(() => {
      saveSettings(settings);
    }, 400);
    return () => {
      if (saveTimer.current !== null) {
        window.clearTimeout(saveTimer.current);
      }
    };
  }, [settings]);

  const setSettings = useCallback(
    (next: Settings | ((prev: Settings) => Settings)) => {
      setSettingsState((prev) =>
        typeof next === "function" ? (next as (p: Settings) => Settings)(prev) : next
      );
    },
    []
  );

  const reset = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, reset }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): Ctx {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}
