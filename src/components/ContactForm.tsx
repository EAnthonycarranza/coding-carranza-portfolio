"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Button from "./ui/Button";
import { Input, Textarea } from "./ui/Field";
import StatusBanner from "./ui/StatusBanner";

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
      setStatus("error");
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
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <div className="grid md:grid-cols-2 gap-8">
          <Input
            id="name"
            name="name"
            label="Full Name"
            type="text"
            required
            placeholder="John Doe"
            autoComplete="name"
          />
          <Input
            id="email"
            name="email"
            label="Email Address"
            type="email"
            required
            placeholder="john@example.com"
            autoComplete="email"
          />
        </div>

        <Textarea
          id="message"
          name="message"
          label="Your Message"
          rows={6}
          required
          placeholder="Tell me about your project or vision..."
        />

        <div ref={captchaRef} className="flex justify-center" />

        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            loading={status === "sending"}
            loadingLabel="Sending..."
            disabled={status === "sending"}
            className="sm:w-auto w-full"
          >
            Send Message
          </Button>
        </div>

        {status === "sent" && (
          <StatusBanner tone="success">
            Message sent! I&apos;ll get back to you within 24 hours.
          </StatusBanner>
        )}
        {status === "error" && (
          <StatusBanner tone="error">
            {errorMsg || "Something went wrong. Please try again."}
          </StatusBanner>
        )}
      </form>
    </>
  );
}
