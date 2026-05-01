'use client';

import { useState, useEffect } from 'react';
import Button from './ui/Button';
import StatusBanner from './ui/StatusBanner';

interface Rate {
  objectId: string;
  provider: string;
  servicelevel: {
    name: string;
  };
  amount: string;
  currency: string;
  estimatedDays: number;
  durationTerms: string;
  providerImage75: string;
}

interface Transaction {
  objectId: string;
  trackingNumber: string;
  labelUrl: string;
  status: string;
}

export default function ShippingEstimator() {
  const [zip, setZip] = useState('90210');
  const [city, setCity] = useState('Beverly Hills');
  const [state, setState] = useState('CA');

  useEffect(() => {
    if (zip === '90210') {
      setCity('Beverly Hills');
      setState('CA');
    } else if (zip === '78233') {
      setCity('San Antonio');
      setState('TX');
    }
  }, [zip]);

  const [rates, setRates] = useState<Rate[]>([]);
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');

  const fetchRates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zip) return;

    setLoading(true);
    setError('');
    setRates([]);
    setSelectedRate(null);
    setTransaction(null);

    try {
      const response = await fetch('/api/shipping/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toAddress: { zip, city, state }
        }),
      });

      const data = await response.json();
      if (data.success) {
        setRates(data.rates);
      } else {
        setError(data.error || 'Failed to fetch rates');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const purchaseLabel = async () => {
    if (!selectedRate) return;

    setPurchasing(true);
    setError('');

    try {
      const response = await fetch('/api/shipping/label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rateId: selectedRate.objectId
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTransaction(data.transaction);
      } else {
        const detailMsg = data.details && Array.isArray(data.details)
          ? data.details.map((d: { text?: string }) => d.text || d).join(', ')
          : '';
        setError(`${data.error}${detailMsg ? `: ${detailMsg}` : ''}`);
      }
    } catch {
      setError('An unexpected error occurred during purchase');
    } finally {
      setPurchasing(false);
    }
  };

  if (transaction) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm p-6 sm:p-12 rounded-card-lg border border-white/10 text-center space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-500 shadow-2xl max-w-2xl mx-auto">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-accent/15 rounded-pill flex items-center justify-center mx-auto ring-1 ring-accent/30 shadow-inner shadow-accent/20" aria-hidden="true">
          <svg className="w-8 h-8 sm:w-12 sm:h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div>
          <h2 className="text-2xl sm:text-4xl font-black mb-2 sm:mb-3 text-white">Fulfillment Ready!</h2>
          <p className="text-slate-400 text-base sm:text-lg">Label has been generated for your order.</p>
        </div>

        <div className="bg-black/40 p-5 sm:p-8 rounded-card border border-white/10 text-left space-y-4 sm:space-y-6">
          <div>
            <div className="text-xxs uppercase tracking-[0.2em] text-slate-400 font-black">Tracking Number</div>
            <div className="text-lg sm:text-2xl font-mono text-white mt-1 break-all sm:break-normal">{transaction.trackingNumber}</div>
          </div>
          <div>
            <div className="text-xxs uppercase tracking-[0.2em] text-slate-400 font-black">Status</div>
            <div className="text-sm sm:text-base text-slate-200 flex items-center gap-2 mt-1 font-bold" role="status">
              <span aria-hidden="true" className="w-2 h-2 sm:w-3 sm:h-3 rounded-pill bg-accent animate-pulse"></span>
              {transaction.status}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4">
          <a
            href={transaction.labelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 sm:py-5 bg-accent hover:bg-accent-dark text-white rounded-card transition-colors font-bold shadow-xl shadow-accent/20 flex items-center justify-center gap-3 text-base sm:text-lg"
          >
            <svg aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            View Shipping Label
          </a>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-slate-400 hover:text-white font-bold text-xs sm:text-sm transition-colors py-2"
          >
            Start New Shipment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-card-lg border border-white/10 shadow-2xl max-w-2xl w-full mx-auto overflow-hidden">
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
          <span className="p-2 bg-accent/15 rounded-control ring-1 ring-accent/20" aria-hidden="true">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </span>
          Order Fulfillment Center
        </h3>

        <form onSubmit={fetchRates} className="grid sm:grid-cols-3 gap-4 mb-8" aria-label="Shipping destination">
          <div>
            <label htmlFor="ship-zip" className="block text-xxs font-bold text-slate-300 uppercase mb-2 tracking-wider">ZIP Code</label>
            <input
              id="ship-zip"
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="90210"
              autoComplete="postal-code"
              className="w-full bg-black/30 border border-white/10 rounded-control px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-[border-color,box-shadow] text-white placeholder:text-slate-500"
              required
            />
          </div>
          <div>
            <label htmlFor="ship-city" className="block text-xxs font-bold text-slate-300 uppercase mb-2 tracking-wider">City</label>
            <input
              id="ship-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Beverly Hills"
              autoComplete="address-level2"
              className="w-full bg-black/30 border border-white/10 rounded-control px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-[border-color,box-shadow] text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
              loadingLabel="Fetching..."
              disabled={purchasing}
            >
              Check Rates
            </Button>
          </div>
        </form>

        {error && (
          <div className="mb-6">
            <StatusBanner tone="error">
              <strong>Error:</strong> {error}
            </StatusBanner>
          </div>
        )}

        <div className="space-y-3">
          {rates.length > 0 ? (
            <>
              <p className="text-xxs font-bold text-slate-300 uppercase mb-2 tracking-widest">Select a Shipping Method</p>
              <ul className="space-y-3" aria-label="Available shipping rates">
                {rates.map((rate) => (
                  <li key={rate.objectId}>
                    <button
                      type="button"
                      onClick={() => setSelectedRate(rate)}
                      aria-pressed={selectedRate?.objectId === rate.objectId}
                      className={`group w-full flex items-center justify-between p-5 border rounded-card cursor-pointer transition-[border-color,background-color,transform,box-shadow] duration-300 animate-in slide-in-from-bottom-2 ${
                        selectedRate?.objectId === rate.objectId
                          ? 'border-accent bg-accent/15 ring-2 ring-accent/30 shadow-lg shadow-accent/20'
                          : 'bg-black/30 border-white/10 hover:border-accent/40 hover:bg-black/50 hover:-translate-y-0.5 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {rate.providerImage75 && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={rate.providerImage75}
                            alt={rate.provider}
                            className="w-12 h-12 object-contain bg-white p-1 rounded-control border border-white/20 shadow-sm"
                          />
                        )}
                        <div className="text-left">
                          <div className={`font-bold text-base transition-colors ${selectedRate?.objectId === rate.objectId ? 'text-accent' : 'text-white'}`}>
                            {rate.provider}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">
                            {rate.servicelevel.name} • {rate.estimatedDays ? `~${rate.estimatedDays} days` : rate.durationTerms}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-white">${rate.amount}</div>
                        <div className="text-xxs text-slate-400 uppercase tracking-tighter font-bold">{rate.currency}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              {selectedRate && (
                <div className="pt-6 animate-in fade-in zoom-in duration-300">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={purchaseLabel}
                    loading={purchasing}
                    loadingLabel="Purchasing..."
                    leadingIcon={
                      <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                      </svg>
                    }
                  >
                    Purchase Label for ${selectedRate.amount}
                  </Button>
                  <p className="text-xxs text-center text-slate-400 mt-4 italic font-medium">
                    Note: In sandbox mode, no real money is charged and the label is simulated.
                  </p>
                </div>
              )}
            </>
          ) : !loading && !error && (
            <div className="text-center py-12 text-slate-400 bg-black/30 rounded-card border-2 border-dashed border-white/10">
              <svg aria-hidden="true" className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
              <p className="text-sm font-medium">Enter a destination ZIP code to calculate fulfillment options.</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xxs text-slate-400 uppercase tracking-[0.2em] font-bold">
            Full-Stack Logistics Powered by <span className="text-white">Shippo</span>
          </p>
        </div>
      </div>
    </div>
  );
}
