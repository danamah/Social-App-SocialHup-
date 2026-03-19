// src/components/lib/ThemeToggle.jsx
import { useTheme } from "../context/ThemeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`
        relative w-10 h-10 rounded-full flex items-center justify-center
        border transition-all duration-300 cursor-pointer
        ${isDark
          ? "bg-brand-900 border-brand-700 text-brand-300 hover:bg-brand-800"
          : "bg-brand-50  border-brand-200 text-brand-600 hover:bg-brand-100"
        }
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0,   opacity: 1, scale: 1   }}
          exit={{    rotate:  90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          className="text-xl"
        >
          {isDark ? <MdLightMode /> : <MdDarkMode />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}