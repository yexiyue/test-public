import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import type { TransitionBeforeSwapEvent } from "astro:transitions/client";

export default function ThemeButton() {
  const [theme, setTheme] = useState("light");

  const init = (e?: TransitionBeforeSwapEvent) => {
    const newDocument = e?.newDocument || document;
    const stored = localStorage.getItem("theme");
    if (stored) {
      setTheme(stored);
      newDocument.documentElement.setAttribute("data-theme", stored || "light");
    }
  };

  useEffect(() => {
    init();
    document.addEventListener("astro:before-swap", init);

    return () => document.removeEventListener("astro:before-swap", init);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <label className="swap swap-rotate btn btn-circle btn-ghost btn-primary btn-sm">
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      <div className="swap-on">
        <Sun size={18} />
      </div>
      <div className="swap-off">
        <Moon size={18} />
      </div>
    </label>
  );
}
