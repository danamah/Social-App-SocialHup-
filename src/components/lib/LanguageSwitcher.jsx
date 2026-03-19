// src/components/lib/LanguageSwitcher.jsx
import { useState, useRef, useEffect } from "react";
import { useLang } from "../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDownOutline } from "react-icons/io5";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇪🇬" },
];

export default function LanguageSwitcher() {
  const { lang, toggleLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find((l) => l.code === lang);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(code) {
    if (code !== lang) toggleLang();
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          flex items-center gap-1.5 px-3 h-10 rounded-full
          border text-sm font-medium transition-all duration-200 cursor-pointer
          dark:bg-brand-900 dark:border-brand-700 dark:text-brand-200 dark:hover:bg-brand-800
          bg-brand-50 border-brand-200 text-brand-700 hover:bg-brand-100
        `}
      >
        <span>{current?.flag ?? '🇺🇳'}</span>
        <span className="hidden sm:inline">{current?.label || 'Language'}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-xs opacity-60"
        >
          <IoChevronDownOutline />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1     }}
            exit={{    opacity: 0, y: -6, scale: 0.97  }}
            transition={{ duration: 0.15 }}
            className={`
              absolute top-12 end-0 z-50 min-w-[140px]
              rounded-xl border shadow-lg overflow-hidden
              dark:bg-brand-900 dark:border-brand-700
              bg-white border-brand-100
            `}
          >
            {LANGUAGES.map((l) => (
              <li
                key={l.code}
                role="option"
                aria-selected={l.code === lang}
                onClick={() => handleSelect(l.code)}
                className={`
                  flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer
                  transition-colors duration-150
                  ${l.code === lang
                    ? "dark:bg-brand-800 dark:text-brand-300 bg-brand-50 text-brand-700 font-semibold"
                    : "dark:text-brand-200 dark:hover:bg-brand-800 text-gray-700 hover:bg-brand-50"
                  }
                `}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
                {l.code === lang && (
                  <span className="ms-auto text-brand-500">✓</span>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}