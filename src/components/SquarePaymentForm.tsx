'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import Button from './ui/Button';

interface SquarePaymentFormProps {
  amount: string;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    Square: any;
  }
}

export default function SquarePaymentForm({ amount, onSuccess, onError }: SquarePaymentFormProps) {
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID || 'sandbox-sq0idb-4wzY4PPEzWYoPk_iThnMqw';

  useEffect(() => {
    if (!scriptLoaded || !window.Square || !cardContainerRef.current || payments) return;

    async function initializeSquare() {
      console.log('Initializing Square with App ID:', appId);
      if (!window.Square) {
        console.error('Square script not loaded yet');
        return;
      }

      try {
        const instance = window.Square.payments(appId);
        console.log('Square instance created');
        setPayments(instance);

        const cardInstance = await instance.card({
          style: {
            input: {
              color: '#f1f5f9',
              fontSize: '16px',
            },
            '.input-container': {
              borderColor: 'rgba(255,255,255,0.10)',
              borderRadius: '12px',
            },
            '.input-container.is-focus': {
              borderColor: 'rgb(16, 185, 129)',
            },
            '.input-container.is-error': {
              borderColor: 'rgb(239, 68, 68)',
            },
            '.message-text': {
              color: 'rgb(148, 163, 184)',
            },
            '.message-icon': {
              color: 'rgb(148, 163, 184)',
            },
            '.message-text.is-error': {
              color: 'rgb(239, 68, 68)',
            },
            '.message-icon.is-error': {
              color: 'rgb(239, 68, 68)',
            },
          },
        });
        console.log('Card instance created');
        await cardInstance.attach('#card-container');
        console.log('Card instance attached');
        setCard(cardInstance);
        setLoading(false);
      } catch (e: any) {
        console.error('Failed to initialize Square:', e);
        setLoading(false);
        onError(`Square Error: ${e.message || 'Unknown initialization error'}`);
      }
    }

    initializeSquare();
  }, [appId, onError, payments, scriptLoaded]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card || submitting) return;

    setSubmitting(true);
    try {
      const result = await card.tokenize();
      if (result.status === 'OK') {
        const response = await fetch('/api/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: result.token,
            amount: amount,
            locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
          }),
        });

        const data = await response.json();
        if (data.success) {
          onSuccess(data.result);
        } else {
          onError(data.error || 'Payment failed');
        }
      } else {
        onError(result.errors[0].message);
      }
    } catch (e) {
      console.error('Payment Error:', e);
      onError('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Script
        src="https://sandbox.web.squarecdn.com/v1/square.js"
        onLoad={() => {
          console.log('Square script loaded via next/script');
          setScriptLoaded(true);
        }}
      />
      
      <div className="bg-black/30 rounded-card-lg border border-white/10 shadow-2xl overflow-hidden max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-accent/15 ring-1 ring-accent/30 rounded-control" aria-hidden="true">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white">Secure Checkout</h3>
          </div>

          <form onSubmit={handlePayment} className="space-y-6" aria-label="Square payment form">
            <div className="space-y-2">
              <label htmlFor="card-container" className="block text-xxs font-bold text-slate-300 uppercase tracking-widest ml-1">Card Details</label>
              <div
                id="card-container"
                ref={cardContainerRef}
                className="bg-black/40 border border-white/10 p-4 rounded-control focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent transition-[border-color,box-shadow] min-h-12"
              >
                {loading && (
                  <div className="flex items-center justify-center h-full" aria-label="Loading payment form">
                    <div className="animate-spin rounded-pill h-5 w-5 border-b-2 border-accent"></div>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              loading={submitting}
              loadingLabel="Processing..."
            >
              Pay ${amount}
            </Button>

            <p className="mt-6 text-center text-xs text-slate-400">
              Securely processed by <span className="font-semibold text-slate-200">Square Sandbox</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
