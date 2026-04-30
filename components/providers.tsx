"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";

// ─── Locale ───────────────────────────────────────────────────────────────────

interface LocaleContextValue {
    locale: Locale;
    setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
    locale: "es",
    setLocale: () => { },
});

export function useLocale() {
    return useContext(LocaleContext);
}

// ─── Theme ────────────────────────────────────────────────────────────────────

type Theme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "light",
    setTheme: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

// ─── Providers ────────────────────────────────────────────────────────────────

export function Providers({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("es");
    const [theme, setThemeState] = useState<Theme>("light");

    // Initialise from localStorage + system preference on mount
    useEffect(() => {
        const savedLocale = localStorage.getItem("locale");
        if (savedLocale === "es" || savedLocale === "en") setLocaleState(savedLocale);

        const savedTheme = localStorage.getItem("theme") as Theme | null;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const resolved: Theme = savedTheme ?? (prefersDark ? "dark" : "light");
        applyTheme(resolved);
        setThemeState(resolved);
    }, []);

    function applyTheme(t: Theme) {
        document.documentElement.classList.toggle("dark", t === "dark");
    }

    function setLocale(l: Locale) {
        setLocaleState(l);
        localStorage.setItem("locale", l);
    }

    function setTheme(t: Theme) {
        setThemeState(t);
        applyTheme(t);
        localStorage.setItem("theme", t);
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <LocaleContext.Provider value={{ locale, setLocale }}>
                {children}
            </LocaleContext.Provider>
        </ThemeContext.Provider>
    );
}
