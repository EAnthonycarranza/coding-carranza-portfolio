"use client";

import { useState, useEffect } from "react";

interface SpeechButtonProps {
  text: string;
}

export default function SpeechButton({ text }: SpeechButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
    }
  }, []);

  const toggleSpeech = () => {
    if (!supported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Clean up markdown markers if present for better speech
      const cleanText = text
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

  if (!supported) return null;

  return (
    <button
      onClick={toggleSpeech}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${
        isSpeaking 
          ? "bg-red-50 text-red-600 border border-red-100 ring-2 ring-red-100" 
          : "bg-slate-50 text-slate-600 border border-slate-100 hover:bg-white hover:shadow-md"
      }`}
      aria-label={isSpeaking ? "Stop reading" : "Listen to this case study"}
    >
      {isSpeaking ? (
        <>
          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H10a1 1 0 01-1-1v-4z" />
          </svg>
          Stop Listening
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          Listen to Story
        </>
      )}
    </button>
  );
}
