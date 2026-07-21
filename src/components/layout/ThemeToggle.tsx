"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // next-themes resolves the theme from localStorage synchronously on the
    // client's first render, so relying on `resolvedTheme` alone to detect
    // "not yet mounted" causes a hydration mismatch. This mounted flag is the
    // pattern next-themes' own docs recommend to defer the real icon by one
    // render, intentionally trading a cascading render for hydration safety.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="button"
        aria-label="테마 전환"
        variant="ghost"
        size="icon"
        disabled
        className="text-muted-foreground"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="text-muted-foreground hover:bg-surface-hover hover:text-foreground">
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </Button>
  );
}
