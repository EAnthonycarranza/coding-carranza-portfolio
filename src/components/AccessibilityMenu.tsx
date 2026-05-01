"use client";

import { useState, useEffect, useRef } from "react";
import Switch from "./ui/Switch";

interface AccessibilityMenuProps {
  audioText?: string;
}

export default function AccessibilityMenu({ audioText }: AccessibilityMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("contrast-200", "grayscale", "invert");
    } else {
      document.documentElement.classList.remove("contrast-200", "grayscale", "invert");
    }
  }, [highContrast]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSpeech = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      let textToRead = audioText;

      if (!textToRead) {
        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
        textToRead = `${title}. ${metaDesc || ""}`;
      }

      const cleanText = textToRead
        .replace(/\*\*Challenge:\*\*/g, "Challenge.")
        .replace(/\*\*Solution:\*\*/g, "Solution.")
        .replace(/#/g, "");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]" ref={menuRef}>
      {isOpen && (
        <div
          className="absolute bottom-20 right-0 w-80 bg-white rounded-card-lg shadow-2xl border border-slate-100 p-8 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500"
          role="dialog"
          aria-label="Accessibility settings"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent-soft text-accent rounded-card flex items-center justify-center" aria-hidden="true">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-900 font-black uppercase tracking-[0.15em] text-xxs">
                Access Tools
              </h3>
              <p className="text-slate-400 text-xs font-bold">Personalize your view</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-sm font-bold text-slate-700" id="font-size-label">Text Size</span>
                <span className="text-xs font-black text-accent" aria-live="polite">{fontSize}%</span>
              </div>
              <div className="flex gap-2 p-1 bg-slate-50 rounded-card" role="group" aria-labelledby="font-size-label">
                <button
                  type="button"
                  onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-900 font-bold py-3 rounded-control shadow-sm transition-[background-color,transform] active:scale-95"
                  aria-label="Decrease font size"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize(100)}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-900 font-bold py-3 rounded-control shadow-sm transition-[background-color,transform] active:scale-95"
                  aria-label="Reset font size to 100%"
                >
                  100%
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize(Math.min(150, fontSize + 10))}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-900 font-bold py-3 rounded-control shadow-sm transition-[background-color,transform] active:scale-95"
                  aria-label="Increase font size"
                >
                  A+
                </button>
              </div>
            </div>

            <Switch
              checked={highContrast}
              onChange={setHighContrast}
              label="High Contrast"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              }
            />

            <button
              type="button"
              onClick={toggleSpeech}
              aria-pressed={isSpeaking}
              className={`w-full flex items-center gap-4 p-5 rounded-card font-bold transition-[background-color,color,box-shadow] duration-300 ${
                isSpeaking
                  ? "bg-danger-soft text-danger ring-4 ring-danger/10"
                  : "bg-accent-soft text-accent hover:bg-white hover:shadow-lg hover:shadow-accent/5"
              }`}
            >
              <span
                aria-hidden="true"
                className={`w-8 h-8 rounded-control flex items-center justify-center ${isSpeaking ? "bg-danger/10" : "bg-accent/10"}`}
              >
                {isSpeaking ? (
                  <span className="flex gap-0.5 items-center">
                    <span className="w-1 h-3 bg-danger animate-bounce" />
                    <span className="w-1 h-4 bg-danger animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-3 bg-danger animate-bounce [animation-delay:0.4s]" />
                  </span>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </span>
              <span>{isSpeaking ? "Stop Reading" : "Listen to Page"}</span>
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close accessibility menu" : "Open accessibility menu"}
        aria-expanded={isOpen}
        className={`w-16 h-16 rounded-card-lg flex items-center justify-center shadow-2xl transition-[background-color,color,transform] duration-500 hover:scale-110 active:scale-90 group ${
          isOpen ? "bg-slate-900 text-white rotate-90" : "bg-white text-accent hover:bg-accent hover:text-white"
        }`}
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-9 h-9 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}
