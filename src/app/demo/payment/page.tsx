'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import SquarePaymentForm from '@/components/SquarePaymentForm';
import StripePaymentForm from '@/components/StripePaymentForm';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Provider = 'square' | 'stripe';
type Experience = 'embedded' | 'hosted';

interface InvoiceItem {
  name: string;
  price: number;
  qty: number;
}

function PaymentDemoContent() {
  const searchParams = useSearchParams();
  const [activeProvider, setActiveProvider] = useState<Provider>('square');
  const [experience, setExperience] = useState<Experience>('embedded');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error' | 'redirecting'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [receiptEmail, setReceiptEmail] = useState('');
  const [sendingReceipt, setSendingReceipt] = useState(false);
  const [receiptSent, setReceiptSent] = useState(false);

  // Dynamic Params from Email
  const urlInvoiceId = searchParams.get('invoice');
  const urlAmount = searchParams.get('amount');
  const urlName = searchParams.get('name');
  const isSuccess = searchParams.get('success');

  useEffect(() => {
    if (isSuccess) {
      setPaymentStatus('success');
    }
  }, [isSuccess]);

  // Mock Invoice Data (Dynamic if params exist)
  const invoiceItems: InvoiceItem[] = useMemo(() => {
    if (urlInvoiceId && urlAmount) {
      return [
        { name: `Service for Invoice #${urlInvoiceId}`, price: parseFloat(urlAmount), qty: 1 }
      ];
    }
    return [
      { name: 'Custom Tiered Wedding Cake', price: 450.00, qty: 1 },
      { name: 'Premium Vanilla Bean Filling', price: 25.00, qty: 1 },
      { name: 'Hand-Painted Floral Accents', price: 75.00, qty: 1 },
      { name: 'Refrigerated Delivery (Local)', price: 45.00, qty: 1 },
    ];
  }, [urlInvoiceId, urlAmount]);

  const subtotal = useMemo(() => invoiceItems.reduce((acc, item) => acc + (item.price * item.qty), 0), [invoiceItems]);
  const tax = urlInvoiceId ? 0 : subtotal * 0.08; // No extra tax if it's a fixed invoice amount
  const total = subtotal + tax;

  const handleSuccess = (result: any) => {
    setPaymentStatus('success');
    setPaymentResult(result);
  };

  const handleError = (error: string) => {
    setPaymentStatus('error');
    setErrorMessage(error);
  };

  const handleHostedCheckout = async () => {
    setPaymentStatus('redirecting');
    try {
      const endpoint = activeProvider === 'stripe' ? '/api/pay/stripe' : '/api/pay';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: total.toString(), 
          mode: 'checkout',
          items: invoiceItems
        })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to generate checkout link');
      }
    } catch (err: any) {
      handleError(err.message);
      setPaymentStatus('error');
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setErrorMessage('');
    setPaymentResult(null);
    setReceiptEmail('');
    setReceiptSent(false);
    window.history.replaceState({}, '', window.location.pathname);
  };

  const sendReceiptEmail = async () => {
    if (!receiptEmail) return;
    setSendingReceipt(true);
    try {
      await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'receipt',
          email: receiptEmail,
          name: urlName || 'Valued Customer',
          items: invoiceItems,
          total: total.toFixed(2),
          provider: activeProvider === 'square' ? 'Square' : 'Stripe',
          invoiceId: urlInvoiceId || 'SB-2024-0892',
        }),
      });
      setReceiptSent(true);
    } catch (err) {
      console.error('Receipt email error:', err);
    } finally {
      setSendingReceipt(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-deep text-white selection:bg-indigo-500/30 overflow-hidden font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] transition-colors duration-1000 blur-[120px] rounded-full ${activeProvider === 'square' ? 'bg-slate-500/10' : 'bg-indigo-500/20'}`}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 lg:pt-32 pb-10 sm:pb-20 lg:pb-32">
        <div className="mb-8 sm:mb-12 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-1 sm:mb-2 text-white">Checkout <span className="text-slate-500">Center</span></h1>
            <p className="text-slate-400 font-medium text-xs sm:text-base">Enterprise-grade payment infrastructures.</p>
          </div>
          <Link href="/demo" className="bg-white/5 hover:bg-white/10 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/10 transition-all flex items-center gap-2 font-bold text-xs sm:text-sm">
            <i className="fas fa-arrow-left text-xs"></i>
            <span className="hidden sm:inline">Exit Demo</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-12 items-start">
          
          {/* Left: Digital Invoice */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6 animate-in slide-in-from-left duration-1000">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-card sm:rounded-pill overflow-hidden shadow-2xl relative">
              <div aria-hidden="true" className="absolute -top-32 -right-32 w-64 h-64 bg-accent-secondary/10 blur-3xl rounded-pill pointer-events-none"></div>
              <div aria-hidden="true" className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/10 blur-3xl rounded-pill pointer-events-none"></div>

              <div className="p-5 sm:p-10 relative z-10">
                <div className="flex justify-between items-start mb-6 sm:mb-12">
                  <div>
                    <div className="font-black text-lg sm:text-2xl mb-1 tracking-tighter"><span className="text-accent-secondary">SWEET BYTES</span><span className="text-white">BAKERY</span></div>
                    <div className="text-xxs sm:text-xxs font-black text-slate-400 uppercase tracking-widest">Invoice #{urlInvoiceId || 'SB-2024-0892'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xxs font-black text-slate-400 uppercase tracking-widest mb-1">Bill To</div>
                    <div className="text-white font-bold text-sm truncate max-w-[150px]">{urlName || 'Valued Customer'}</div>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-12">
                  <div className="text-xxs font-black text-slate-400 uppercase tracking-widest border-b border-white/10 pb-2">Order Breakdown</div>
                  {invoiceItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center group">
                      <div>
                        <div className="text-white font-bold text-sm group-hover:text-accent-secondary transition-colors">{item.name}</div>
                        <div className="text-xs text-slate-500">Qty: {item.qty}</div>
                      </div>
                      <div className="text-white font-mono font-bold">${item.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-8 border-t-2 border-dashed border-white/10">
                  <div className="flex justify-between text-slate-400 text-sm font-medium">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-sm font-medium">
                    <span>Estimated Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <div>
                      <div className="text-xxs font-black text-accent-secondary uppercase tracking-[0.2em] mb-1">Amount Due</div>
                      <div className="text-white text-3xl sm:text-5xl font-black tracking-tighter">${total.toFixed(2)}</div>
                    </div>
                    <div className="text-right pb-1">
                      <div className="text-xxs text-accent font-black flex items-center gap-1 justify-end">
                        <i aria-hidden="true" className="fas fa-shield-halved"></i> SECURE
                      </div>
                      <div className="text-xxs text-slate-500 font-bold uppercase tracking-widest">USD Currency</div>
                    </div>
                  </div>
                </div>
              </div>

              <div aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-6 bg-surface-deep rounded-t-full"></div>
            </div>

            <div className="p-4 sm:p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl sm:rounded-3xl">
              <p className="text-indigo-300 text-xxs sm:text-xs leading-relaxed font-medium">
                <i className="fas fa-info-circle mr-2 text-indigo-400"></i>
                Toggle between <strong>Embedded</strong> (in-site) and <strong>Hosted</strong> (redirect) checkout experiences.
              </p>
            </div>
          </div>

          {/* Right: Payment Interface */}
          <div className="lg:col-span-7 animate-in slide-in-from-right duration-1000">
            {paymentStatus === 'success' ? (
              <div className="bg-white p-6 sm:p-12 lg:p-16 rounded-2xl sm:rounded-card-lg border border-slate-200 text-center space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
                  <i className="fas fa-check text-2xl sm:text-4xl text-emerald-500"></i>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-4xl font-black mb-2 text-slate-900 tracking-tight">Payment Complete!</h2>
                  <p className="text-slate-500 font-medium text-sm sm:text-base">Transaction recorded in the sandbox.</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-card border border-slate-100 text-left space-y-3 max-w-md mx-auto w-full">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-bold uppercase tracking-widest text-xxs opacity-60">Authorized</span>
                    <span className="text-slate-900 font-bold text-xs">{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                    <span className="font-bold uppercase tracking-widest text-xxs opacity-60">Status</span>
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xxs font-black uppercase tracking-widest">PAID</span>
                  </div>
                </div>

                {/* Email Receipt Section */}
                <div className="max-w-md mx-auto w-full bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-left">
                  <p className="text-xxs font-black text-indigo-900 uppercase tracking-widest mb-3"><i className="fas fa-envelope mr-2"></i>Send Paid Receipt</p>
                  {receiptSent ? (
                    <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm">
                      <i className="fas fa-circle-check text-lg"></i>
                      <span>Receipt sent to <strong>{receiptEmail}</strong>!</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <label htmlFor="payment-receipt-email" className="sr-only">Receipt email address</label>
                      <input
                        id="payment-receipt-email"
                        type="email"
                        placeholder="your-email@example.com"
                        value={receiptEmail}
                        onChange={(e) => setReceiptEmail(e.target.value)}
                        autoComplete="email"
                        className="flex-1 px-4 py-3 rounded-control border border-accent-secondary/30 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent-secondary/30 placeholder:text-slate-400 transition-[border-color,box-shadow]"
                      />
                      <button
                        onClick={sendReceiptEmail}
                        disabled={!receiptEmail || sendingReceipt}
                        className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-40 whitespace-nowrap flex items-center gap-2"
                      >
                        {sendingReceipt ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-paper-plane"></i>}
                        Send
                      </button>
                    </div>
                  )}
                  <p className="text-indigo-400 text-xxs mt-2 font-medium">Optional — receive a professional PAID invoice receipt via email.</p>
                </div>

                <button 
                  onClick={resetPayment}
                  className="max-w-md mx-auto w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all font-black shadow-2xl shadow-slate-200 text-lg flex items-center justify-center gap-3"
                >
                  <i className="fas fa-rotate-left"></i>
                  Reset Demo
                </button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-8">
                {/* Experience & Provider Tabs Container */}
                <div className="space-y-4">
                  <div className="flex p-1 bg-white/5 border border-white/10 rounded-card" role="tablist" aria-label="Checkout experience">
                    {(['embedded', 'hosted'] as const).map((exp) => (
                      <button
                        key={exp}
                        type="button"
                        role="tab"
                        aria-selected={experience === exp}
                        onClick={() => setExperience(exp)}
                        className={`flex-1 py-3 rounded-control font-bold text-xs uppercase tracking-widest cursor-pointer transition-[background-color,color,box-shadow,transform] duration-300 ${
                          experience === exp
                            ? 'bg-accent-secondary-dark text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        <i aria-hidden="true" className={exp === 'embedded' ? 'fas fa-window-maximize mr-2' : 'fas fa-external-link-alt mr-2'}></i>
                        {exp} Experience
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 p-1 sm:p-1.5 bg-white/5 border border-white/10 rounded-card sm:rounded-card-lg backdrop-blur-xl" role="tablist" aria-label="Payment provider">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeProvider === 'square'}
                      onClick={() => { setActiveProvider('square'); setPaymentStatus('idle'); }}
                      className={`flex items-center justify-center gap-2 sm:gap-3 py-4 sm:py-6 rounded-control sm:rounded-card font-black cursor-pointer transition-[background-color,color,box-shadow,transform] duration-300 group ${
                        activeProvider === 'square'
                        ? 'bg-accent text-white shadow-2xl shadow-accent/30'
                        : 'text-slate-500 hover:text-white hover:bg-white/5 hover:-translate-y-0.5'
                      }`}
                    >
                      <i aria-hidden="true" className={`fas fa-square text-lg sm:text-2xl transition-transform group-hover:scale-110 ${activeProvider === 'square' ? 'text-white' : 'text-slate-600'}`}></i>
                      <div className="text-left">
                        <div className="text-xxs sm:text-xs uppercase tracking-widest leading-none mb-1 opacity-60">Pay with</div>
                        <div className="text-base sm:text-xl tracking-tighter leading-none">Square</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeProvider === 'stripe'}
                      onClick={() => { setActiveProvider('stripe'); setPaymentStatus('idle'); }}
                      className={`flex items-center justify-center gap-2 sm:gap-3 py-4 sm:py-6 rounded-control sm:rounded-card font-black cursor-pointer transition-[background-color,color,box-shadow,transform] duration-300 group ${
                        activeProvider === 'stripe'
                        ? 'bg-accent-secondary text-white shadow-2xl shadow-accent-secondary/30'
                        : 'text-slate-500 hover:text-white hover:bg-white/5 hover:-translate-y-0.5'
                      }`}
                    >
                      <i aria-hidden="true" className="fab fa-stripe text-2xl sm:text-3xl transition-transform group-hover:scale-110"></i>
                      <div className="text-left">
                        <div className="text-xxs sm:text-xs uppercase tracking-widest leading-none mb-1 opacity-60">Pay with</div>
                        <div className="text-base sm:text-xl tracking-tighter leading-none">Stripe</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-sm rounded-card sm:rounded-card-lg p-5 sm:p-8 lg:p-12 shadow-2xl border border-white/10 relative overflow-hidden">
                  <div aria-hidden="true" className="absolute top-8 right-8 opacity-[0.04] scale-[4] pointer-events-none text-white">
                    {activeProvider === 'square' ? <i className="fas fa-square text-9xl"></i> : <i className="fab fa-stripe text-9xl"></i>}
                  </div>

                  <div className="relative z-10">
                    <div className="mb-6 sm:mb-10">
                      <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight mb-2">
                        {experience === 'embedded' ? 'Secure Embedded Checkout' : 'Dedicated Hosted Checkout'}
                      </h2>
                      <p className="text-slate-400 font-medium leading-relaxed">
                        {experience === 'embedded'
                          ? `The payment form is securely injected into your site via the ${activeProvider} SDK.`
                          : `The user will be redirected to a dedicated, itemized checkout page hosted securely by ${activeProvider}.`}
                      </p>
                    </div>

                    <div className="animate-in fade-in zoom-in-95 duration-500">
                      {experience === 'embedded' ? (
                        <>
                          <div className="bg-black/30 p-6 rounded-card mb-8 border border-white/10">
                            <div className="flex items-start gap-4">
                              <div aria-hidden="true" className="text-warn mt-1"><i className="fas fa-vial text-xl"></i></div>
                              <div>
                                <p className="text-xxs font-black text-white uppercase tracking-widest mb-2">Sandbox Test Values</p>
                                <div className="text-xs text-slate-300 space-y-1.5 font-medium">
                                  <p>Card: <code className="bg-white/10 text-white px-2 py-0.5 rounded font-black border border-white/15">
                                    {activeProvider === 'square' ? '4111 1111 1111 1111' : '4242 4242 4242 4242'}
                                  </code></p>
                                  <p>Expiry: <strong className="text-white">Any future date</strong> (e.g., 12/26)</p>
                                  <p>CVV: <strong className="text-white">Any 3 digits</strong> (e.g., 123)</p>
                                  <p>Zip Code: <strong className="text-white">Any valid zip</strong> (e.g., 10001)</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          {activeProvider === 'square' ? (
                            <SquarePaymentForm amount={total.toString()} onSuccess={handleSuccess} onError={handleError} />
                          ) : (
                            <StripePaymentForm amount={total.toString()} onSuccess={handleSuccess} onError={handleError} />
                          )}

                          <div className="mt-6 flex items-center justify-between bg-black/30 border border-white/10 rounded-control px-5 py-3">
                            <p className="text-slate-400 text-xxs font-medium leading-snug">
                              <i aria-hidden="true" className="fas fa-circle-info mr-1.5 text-slate-500"></i>
                              {activeProvider === 'square'
                                ? 'Square SDK may take a moment to load. If the card form stays loading, click Reload.'
                                : 'If the payment form does not appear, try reloading.'}
                            </p>
                            <button
                              type="button"
                              onClick={() => window.location.reload()}
                              className="ml-4 flex-shrink-0 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-control text-xxs font-bold transition-colors flex items-center gap-1.5"
                            >
                              <i aria-hidden="true" className="fas fa-rotate-right"></i>
                              Reload
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="py-4">
                           <div className="bg-black/30 rounded-card p-6 border border-white/10 text-center space-y-4 mb-6">
                              <div aria-hidden="true" className="w-14 h-14 bg-white/5 ring-1 ring-white/10 rounded-card shadow-sm flex items-center justify-center mx-auto text-2xl">
                                {activeProvider === 'square' ? <i className="fas fa-external-link-alt text-white"></i> : <i className="fab fa-stripe text-accent-secondary"></i>}
                              </div>
                              <div>
                                <h3 className="text-white font-black text-lg mb-1">Redirect to {activeProvider === 'square' ? 'Square Link' : 'Stripe Session'}</h3>
                                <p className="text-slate-400 text-sm max-w-[280px] mx-auto">Click below to launch the professional, itemized checkout page.</p>
                              </div>
                           </div>

                           {activeProvider === 'square' && (
                             <div className="bg-warn/10 border border-warn/20 rounded-card p-5 mb-6 text-left">
                               <p className="text-xxs font-black text-warn uppercase tracking-widest mb-3"><i aria-hidden="true" className="fas fa-flask mr-2"></i>Square Sandbox Testing Guide</p>
                               <div className="text-xs text-amber-100/90 space-y-2 font-medium leading-relaxed">
                                 <p><strong>Step 1:</strong> Click &quot;Launch Checkout Page&quot; below. You&apos;ll be redirected to Square&apos;s <strong className="text-warn">Checkout API Sandbox Testing Panel</strong>.</p>
                                 <p><strong>Step 2 — Overview:</strong> You&apos;ll see your <code className="bg-warn/20 px-1.5 py-0.5 rounded text-warn font-bold">order_id</code> and a <strong className="text-warn">Preview Link</strong> button. Click <strong className="text-warn">Next</strong> to proceed.</p>
                                 <p><strong>Step 3 — Test Payment:</strong> Click <strong className="text-warn">Test Payment</strong> to simulate a customer completing the checkout. Or click <strong className="text-warn">Preview Link</strong> to see what your customers would see.</p>
                                 <p><strong>Step 4 — Complete:</strong> You&apos;ll see &quot;Checkout Complete&quot; with the order state as <strong className="text-warn">OPEN</strong>, webhooks triggered, and you&apos;ll be redirected back here automatically.</p>
                               </div>
                             </div>
                           )}

                           {activeProvider === 'stripe' && (
                             <div className="bg-accent-secondary/10 border border-accent-secondary/20 rounded-card p-5 mb-6 text-left">
                               <p className="text-xxs font-black text-accent-secondary uppercase tracking-widest mb-3"><i aria-hidden="true" className="fas fa-vial mr-2"></i>Stripe Sandbox — Use Demo Card</p>
                               <div className="text-xs text-slate-300 space-y-2 font-medium leading-relaxed">
                                 <p>This is a <strong className="text-white">test environment</strong> — no real charges will be made. On the Stripe checkout page, use the following test credentials:</p>
                                 <p>Card Number: <code className="bg-accent-secondary/20 px-1.5 py-0.5 rounded text-accent-secondary font-bold">4242 4242 4242 4242</code></p>
                                 <p>Expiry: <strong className="text-white">Any future date</strong> (e.g., 12/26)</p>
                                 <p>CVC: <strong className="text-white">Any 3 digits</strong> (e.g., 123)</p>
                                 <p>Email &amp; Name: <strong className="text-white">Anything you like</strong></p>
                               </div>
                             </div>
                           )}
                           <button
                            type="button"
                            disabled={paymentStatus === 'redirecting'}
                            onClick={handleHostedCheckout}
                            className={`w-full py-6 rounded-card font-black text-xl shadow-2xl cursor-pointer transition-[background-color,transform,box-shadow] duration-300 flex items-center justify-center gap-4 hover:-translate-y-0.5 active:translate-y-0 ${
                              activeProvider === 'square'
                                ? 'bg-white text-slate-900 hover:bg-slate-100'
                                : 'bg-accent-secondary text-white hover:bg-accent-secondary-dark'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                           >
                            {paymentStatus === 'redirecting' ? (
                              <><i aria-hidden="true" className="fas fa-spinner animate-spin"></i> Generating Session...</>
                            ) : (
                              <><i aria-hidden="true" className="fas fa-bolt"></i> Launch Checkout Page</>
                            )}
                           </button>
                        </div>
                      )}
                    </div>

                    {paymentStatus === 'error' && (
                      <div role="alert" className="mt-8 p-5 bg-danger-soft border border-danger/20 rounded-card text-danger text-sm flex items-center gap-4 animate-in shake duration-500">
                        <div aria-hidden="true" className="w-10 h-10 rounded-pill bg-danger/20 flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div>
                          <strong className="font-black uppercase text-xxs block mb-0.5 tracking-widest">System Error</strong>
                          <p className="font-medium opacity-80">{errorMessage}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .text-gradient { background: linear-gradient(135deg, #fff 0%, #64748b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </main>
  );
}

export default function PaymentDemoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-deep flex items-center justify-center" role="status" aria-label="Loading payment demo"><div className="animate-spin rounded-pill h-12 w-12 border-t-2 border-b-2 border-accent-secondary"></div></div>}>
      <PaymentDemoContent />
    </Suspense>
  );
}
