"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";

declare global {
  interface Window {
    grecaptcha: {
      render: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void }) => number;
      reset: (widgetId: number) => void;
    };
  }
}

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) return;

    function renderCaptcha() {
      if (captchaRef.current && window.grecaptcha && widgetIdRef.current === null) {
        widgetIdRef.current = window.grecaptcha.render(captchaRef.current, {
          sitekey: siteKey!,
          callback: (token: string) => setCaptchaToken(token),
          "expired-callback": () => setCaptchaToken(""),
        });
      }
    }

    if (window.grecaptcha) {
      renderCaptcha();
    } else {
      (window as unknown as Record<string, () => void>).onRecaptchaLoad = renderCaptcha;
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    if (!captchaToken) {
      setErrorMsg("Please complete the reCAPTCHA verification.");
      return;
    }

    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      captchaToken,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
        setCaptchaToken("");
        if (widgetIdRef.current !== null && window.grecaptcha) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
      } else {
        const result = await res.json();
        setErrorMsg(result.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <script
        src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
        async
        defer
      />
      <div className="glass p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-accent/5">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-bold text-slate-900 ml-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="John Doe"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-slate-900 ml-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-bold text-slate-900 ml-1">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              placeholder="Tell me about your project or vision..."
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white transition-all resize-none placeholder:text-slate-400"
            />
          </div>

          <div ref={captchaRef} className="flex justify-center" />

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full sm:w-auto bg-accent hover:bg-accent-dark text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-accent/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
            >
              {status === "sending" ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : "Send Message"}
            </button>
          </div>
          
          {status === "sent" && (
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 text-accent text-center font-bold animate-in fade-in zoom-in duration-300">
              ✓ Message sent! I&apos;ll get back to you within 24 hours.
            </div>
          )}
          {(status === "error" || errorMsg) && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-red-500 text-center font-bold">
              ✕ {errorMsg || "Something went wrong. Please try again."}
            </div>
          )}
        </form>
    </>
  );
}
