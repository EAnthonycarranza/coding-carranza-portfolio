'use client';

import { useEffect, useState } from 'react';
import StatusBanner from './ui/StatusBanner';

const PRESET_AMOUNTS = [5, 10, 25, 50];

export default function DonationButton() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState<'success' | 'cancelled' | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const status = params.get('donation');
    if (status === 'success') setBanner('success');
    else if (status === 'cancelled') setBanner('cancelled');
    if (status) {
      const url = new URL(window.location.href);
      url.searchParams.delete('donation');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  const handleDonate = async () => {
    setError('');
    if (!Number.isFinite(finalAmount) || finalAmount < 1) {
      setError('Please enter an amount of at least $1.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount, name, message }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Could not start checkout.');
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 rounded-card-lg bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 p-[2px] shadow-xl">
      <div className="bg-white rounded-card p-6">
        {banner === 'success' && (
          <div className="mb-4">
            <StatusBanner tone="success">
              Thank you for your support! Your donation went through.
            </StatusBanner>
          </div>
        )}
        {banner === 'cancelled' && (
          <div className="mb-4">
            <StatusBanner tone="warn">
              Donation cancelled. No charge was made — feel free to try again.
            </StatusBanner>
          </div>
        )}

        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-card bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center text-white text-xl" aria-hidden="true">
            ☕
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">Support My Work</h3>
            <p className="text-xs text-slate-500">Buy me a coffee — fuel the next side project.</p>
          </div>
        </div>

        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            className="mt-4 w-full py-3.5 rounded-card bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Donate</span>
            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        ) : (
          <div className="mt-4 space-y-4">
            <fieldset>
              <legend className="text-xxs font-black text-slate-600 uppercase tracking-widest mb-2">Choose Amount (USD)</legend>
              <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Preset donation amount">
                {PRESET_AMOUNTS.map(v => {
                  const selected = !customAmount && amount === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => { setAmount(v); setCustomAmount(''); }}
                      className={`py-3 rounded-control text-sm font-bold transition-[background-color,border-color,color] border ${selected ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'}`}
                    >
                      ${v}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="donate-custom" className="text-xxs font-black text-slate-600 uppercase tracking-widest block mb-2">Custom Amount</label>
              <div className="relative">
                <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  id="donate-custom"
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="1"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  placeholder="Other amount"
                  className="w-full pl-8 pr-4 py-3 rounded-control border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-300 transition-[border-color,box-shadow]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <label htmlFor="donate-name" className="sr-only">Your name (optional)</label>
              <input
                id="donate-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name (optional)"
                autoComplete="name"
                className="w-full px-4 py-3 rounded-control border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-300 transition-[border-color,box-shadow]"
              />
              <label htmlFor="donate-message" className="sr-only">Note (optional)</label>
              <textarea
                id="donate-message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Leave a note (optional)"
                rows={2}
                className="w-full px-4 py-3 rounded-control border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-300 transition-[border-color,box-shadow] resize-none"
              />
            </div>

            {error && (
              <p role="alert" className="text-rose-500 text-xs font-bold">{error}</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setOpen(false); setError(''); }}
                disabled={submitting}
                className="px-4 py-3 rounded-control bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDonate}
                disabled={submitting || !Number.isFinite(finalAmount) || finalAmount < 1}
                aria-busy={submitting || undefined}
                className="flex-1 py-3 rounded-control bg-gradient-to-r from-rose-500 to-orange-400 text-white font-bold text-sm shadow-lg disabled:opacity-50 transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg aria-hidden="true" className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
                    Redirecting…
                  </>
                ) : (
                  <>Donate ${Number.isFinite(finalAmount) ? finalAmount.toFixed(0) : '0'}</>
                )}
              </button>
            </div>

            <p className="text-xxs text-slate-400 text-center font-medium">
              Secure checkout by Stripe — your card never touches this server.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
