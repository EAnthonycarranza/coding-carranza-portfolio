"use client";

import { useState, useEffect, useRef } from "react";

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
    // Apply font size to document
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    // Apply high contrast
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
      // If specific text is provided, use it. Otherwise, read page title and meta description.
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
      {/* Menu Backdrop/Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-900 font-black uppercase tracking-[0.15em] text-[10px]">
                Access Tools
              </h3>
              <p className="text-slate-400 text-xs font-bold">Personalize your view</p>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Font Size */}
            <div>
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-sm font-bold text-slate-700">Text Size</span>
                <span className="text-xs font-black text-accent">{fontSize}%</span>
              </div>
              <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl">
                <button 
                  onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-900 font-bold py-3 rounded-xl shadow-sm transition-all active:scale-95"
                  aria-label="Decrease font size"
                >
                  A-
                </button>
                <button 
                  onClick={() => setFontSize(100)}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-900 font-bold py-3 rounded-xl shadow-sm transition-all active:scale-95"
                  aria-label="Reset font size"
                >
                  100%
                </button>
                <button 
                  onClick={() => setFontSize(Math.min(150, fontSize + 10))}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-900 font-bold py-3 rounded-xl shadow-sm transition-all active:scale-95"
                  aria-label="Increase font size"
                >
                  A+
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <button 
              onClick={() => setHighContrast(!highContrast)}
              className={`w-full flex items-center justify-between p-5 rounded-2xl font-bold transition-all ${
                highContrast 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                  : "bg-slate-50 text-slate-700 hover:bg-white hover:shadow-lg hover:shadow-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${highContrast ? "bg-white/10" : "bg-white"}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <span>High Contrast</span>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${highContrast ? "bg-accent" : "bg-slate-300"}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${highContrast ? "right-1" : "left-1"}`} />
              </div>
            </button>

            {/* Audio Reader */}
            <button 
              onClick={toggleSpeech}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl font-bold transition-all ${
                isSpeaking 
                  ? "bg-red-50 text-red-600 ring-4 ring-red-50" 
                  : "bg-accent/5 text-accent hover:bg-white hover:shadow-lg hover:shadow-accent/5"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSpeaking ? "bg-red-100" : "bg-accent/10"}`}>
                {isSpeaking ? (
                  <div className="flex gap-0.5 items-center">
                    <div className="w-1 h-3 bg-red-600 animate-bounce" />
                    <div className="w-1 h-4 bg-red-600 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-3 bg-red-600 animate-bounce [animation-delay:0.4s]" />
                  </div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </div>
              <span>{isSpeaking ? "Stop Reading" : "Listen to Page"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 group ${
          isOpen ? "bg-slate-900 text-white rotate-90" : "bg-white text-accent hover:bg-accent hover:text-white"
        }`}
        aria-label="Accessibility Menu"
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-9 h-9 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}
