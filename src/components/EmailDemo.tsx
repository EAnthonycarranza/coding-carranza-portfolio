'use client';

import { useState, useRef, useEffect } from 'react';

type Scenario = 'quote' | '2fa' | 'password-reset' | 'order' | 'invoice';

interface Log {
  id: string;
  timestamp: Date;
  status: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

export default function EmailDemo() {
  const [activeScenario, setActiveScenario] = useState<Scenario>('quote');
  const [formData, setFormData] = useState({ name: '', email: '', occasion: 'Birthday', flavor: 'Chocolate', size: '1 Tier', notes: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'verified' | 'tracking' | 'resetting'>('idle');
  const [logs, setLogs] = useState<Log[]>([]);
  const [htmlPreview, setHtmlPreview] = useState<string | null>(null);
  const [receivedCode, setReceivedCode] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState('');
  const logScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logScrollRef.current) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      status: type.toUpperCase(),
      message: msg,
      type
    }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;

    setStatus('submitting');
    setLogs([]);
    setHtmlPreview(null);
    addLog(`Initiating ${activeScenario} automation...`, 'info');

    try {
      addLog('Acquiring SMTP Transporter...', 'info');
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeScenario, ...formData })
      });

      const data = await response.json();
      if (response.ok) {
        addLog(`Email dispatched to ${formData.email}`, 'success');
        setHtmlPreview(data.html);
        if (activeScenario === '2fa') setReceivedCode(data.code);
        setStatus('sent');
      } else {
        throw new Error(data.error || 'Failed to send');
      }
    } catch (err: any) {
      addLog(`Error: ${err.message}`, 'error');
      setStatus('idle');
    }
  };

  const verify2FA = () => {
    if (inputCode === receivedCode) {
      addLog('Verification code matched! Identity confirmed.', 'success');
      setStatus('verified');
    } else {
      addLog('Invalid code entered. Please check your "inbox".', 'error');
    }
  };

  const scenarios = [
    { id: 'quote', label: 'Quote', icon: 'fa-file-invoice-dollar', color: 'indigo' },
    { id: 'invoice', label: 'Digital Invoice', icon: 'fa-receipt', color: 'rose' },
    { id: '2fa', label: '2FA', icon: 'fa-shield-halved', color: 'emerald' },
    { id: 'password-reset', label: 'Reset', icon: 'fa-key', color: 'amber' },
    { id: 'order', label: 'Order', icon: 'fa-box-open', color: 'blue' }
  ];

  return (
    <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      <div className="lg:col-span-3 space-y-4" role="tablist" aria-label="Automation scenarios">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-4 mb-4">Automation Suite</h3>
        {scenarios.map(s => (
          <button
            type="button"
            key={s.id}
            role="tab"
            aria-selected={activeScenario === s.id}
            onClick={() => { setActiveScenario(s.id as Scenario); setStatus('idle'); setHtmlPreview(null); }}
            className={`group w-full flex items-center gap-4 p-4 rounded-card border cursor-pointer transition-[background-color,border-color,transform,box-shadow] duration-300 text-left ${
              activeScenario === s.id
                ? 'bg-accent-secondary/15 border-accent-secondary/40 ring-1 ring-accent-secondary/30 shadow-xl shadow-accent-secondary/20 scale-[1.02]'
                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 hover:text-slate-200'
            }`}
          >
            <div aria-hidden="true" className={`w-10 h-10 rounded-control flex items-center justify-center text-lg transition-colors ${
              activeScenario === s.id ? 'bg-accent-secondary text-white shadow-lg shadow-accent-secondary/30' : 'bg-white/10 text-slate-300'
            }`}>
              <i className={`fas ${s.icon}`}></i>
            </div>
            <div>
              <div className={`font-bold text-sm ${activeScenario === s.id ? 'text-white' : 'text-slate-300'}`}>{s.label}</div>
              <div className={`text-xxs ${activeScenario === s.id ? 'text-accent-secondary/80' : 'text-slate-400/70'}`}>Real-time SMTP Dispatch</div>
            </div>
          </button>
        ))}

        {/* Logs in sidebar on large screens, or below on small */}
        <div className="hidden lg:flex flex-col h-[300px] mt-8 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-xxs font-bold text-slate-500 tracking-widest uppercase">SMTP RELAY LOGS</div>
          <div ref={logScrollRef} className="p-4 overflow-y-auto font-mono text-xxs space-y-2" role="log" aria-live="polite" aria-label="SMTP relay logs">
            {logs.map(log => (
              <div key={log.id} className="text-slate-400">
                <span className={log.type === 'success' ? 'text-accent' : log.type === 'error' ? 'text-danger' : 'text-accent-secondary'}>
                  {log.status === 'SUCCESS' ? '✓' : log.status === 'ERROR' ? '✗' : '•'}
                </span> {log.message}
              </div>
            ))}
            {logs.length === 0 && <div className="italic opacity-30">Awaiting trigger...</div>}
          </div>
        </div>
      </div>

      {/* Main Action Area */}
      <div className="lg:col-span-9 grid lg:grid-cols-2 gap-8">
        
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-card-lg p-8 shadow-2xl border border-white/10 flex flex-col min-h-[500px]">
          {status === 'idle' || status === 'submitting' ? (
            <>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">Trigger Workflow</h2>
                  <p className="text-sm text-slate-400">Configure your demonstration payload</p>
                </div>
                <div className="w-12 h-12 bg-accent-secondary/15 ring-1 ring-accent-secondary/30 rounded-card flex items-center justify-center text-accent-secondary" aria-hidden="true">
                  <i className={`fas ${scenarios.find(s => s.id === activeScenario)?.icon} text-xl`}></i>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" aria-label="Email demo trigger">
                <div className="space-y-1.5">
                  <label htmlFor="email-demo-recipient" className="text-xs font-black text-slate-300 uppercase tracking-wider">Recipient Inbox</label>
                  <div className="relative">
                    <i aria-hidden="true" className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input
                      id="email-demo-recipient"
                      required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 text-white rounded-control pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-accent-secondary/40 focus:border-accent-secondary transition-[border-color,box-shadow] outline-none placeholder:text-slate-500"
                      placeholder="your-email@example.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {(activeScenario === 'quote' || activeScenario === 'order' || activeScenario === 'password-reset') && (
                  <div className="space-y-1.5">
                    <label htmlFor="email-demo-name" className="text-xs font-black text-slate-300 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <i aria-hidden="true" className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                      <input
                        id="email-demo-name"
                        required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 text-white rounded-control pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-accent-secondary/40 focus:border-accent-secondary transition-[border-color,box-shadow] outline-none placeholder:text-slate-500"
                        placeholder="John Doe"
                        autoComplete="name"
                      />
                    </div>
                  </div>
                )}

                {activeScenario === 'quote' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="email-demo-occasion" className="text-xs font-black text-slate-300 uppercase tracking-wider">Occasion</label>
                      <select id="email-demo-occasion" value={formData.occasion} onChange={e => setFormData({...formData, occasion: e.target.value})} className="w-full bg-black/30 border border-white/10 text-white rounded-control px-4 py-3 text-sm focus:ring-2 focus:ring-accent-secondary/40 focus:border-accent-secondary outline-none transition-[border-color,box-shadow]">
                        <option>Birthday</option><option>Wedding</option><option>Corporate</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email-demo-flavor" className="text-xs font-black text-slate-300 uppercase tracking-wider">Flavor</label>
                      <select id="email-demo-flavor" value={formData.flavor} onChange={e => setFormData({...formData, flavor: e.target.value})} className="w-full bg-black/30 border border-white/10 text-white rounded-control px-4 py-3 text-sm focus:ring-2 focus:ring-accent-secondary/40 focus:border-accent-secondary outline-none transition-[border-color,box-shadow]">
                        <option>Chocolate</option><option>Vanilla</option><option>Red Velvet</option>
                      </select>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  aria-busy={status === 'submitting' || undefined}
                  className="w-full bg-accent-secondary hover:bg-accent-secondary-dark text-white font-bold rounded-control py-4 transition-[background-color,box-shadow] shadow-lg shadow-accent-secondary/20 disabled:opacity-50 mt-4"
                >
                  {status === 'submitting' ? 'Dispatched via SMTP...' : `Send ${scenarios.find(s => s.id === activeScenario)?.label} Email`}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col h-full items-center justify-center text-center animate-in zoom-in duration-300">
              {status === 'sent' && activeScenario === '2fa' && (
                <div className="w-full max-w-[280px] space-y-6">
                  <div className="w-16 h-16 bg-accent-secondary-soft text-accent-secondary-dark rounded-card flex items-center justify-center text-2xl mx-auto" aria-hidden="true">
                    <i className="fas fa-unlock-keyhole"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Enter Security Code</h3>
                    <p className="text-xs text-slate-400 mt-2">Check the HTML preview to find your code.</p>
                  </div>
                  <label htmlFor="email-demo-2fa" className="sr-only">Verification code</label>
                  <input
                    id="email-demo-2fa"
                    type="text" inputMode="numeric" maxLength={6} value={inputCode} onChange={e => setInputCode(e.target.value)}
                    className="w-full bg-black/30 border-2 border-accent-secondary/30 text-accent-secondary text-center text-3xl font-black tracking-[10px] rounded-card py-4 focus:border-accent-secondary outline-none transition-[border-color]"
                    aria-label="Verification code"
                  />
                  <button type="button" onClick={verify2FA} className="w-full bg-slate-900 text-white font-bold rounded-control py-4 hover:bg-slate-800 transition-colors">Verify Identity</button>
                </div>
              )}

              {status === 'verified' && (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-accent-soft text-accent rounded-pill flex items-center justify-center text-3xl mx-auto shadow-lg shadow-accent/10 animate-bounce" aria-hidden="true">
                    <i className="fas fa-check"></i>
                  </div>
                  <h3 className="text-2xl font-black text-white">Identity Verified</h3>
                  <p className="text-slate-400 max-w-[240px]">The automation loop is complete. This 2FA flow is ready for production.</p>
                  <button type="button" onClick={() => setStatus('idle')} className="text-accent-secondary font-bold hover:underline">Restart Demo</button>
                </div>
              )}

              {status === 'tracking' && (
                <div className="w-full space-y-8 p-4">
                   <div className="flex items-center justify-between px-2">
                      <h3 className="text-lg font-bold text-white">Real-time Logistics</h3>
                      <span className="bg-accent-secondary/20 text-accent-secondary text-xxs font-black px-2 py-1 rounded-pill uppercase">In Transit</span>
                   </div>
                   <div className="space-y-6 relative py-4">
                      <div aria-hidden="true" className="absolute left-6 top-8 bottom-8 w-0.5 bg-white/10"></div>
                      {[
                        { time: '10:45 AM', status: 'Out for Delivery', done: true, icon: 'fa-van-shuttle' },
                        { time: '08:12 AM', status: 'Arrived at Local Facility', done: true, icon: 'fa-warehouse' },
                        { time: 'Yesterday', status: 'Order Processed', done: true, icon: 'fa-check-circle' }
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-6 relative z-10">
                          <div aria-hidden="true" className={`w-12 h-12 rounded-card flex items-center justify-center text-lg shadow-sm border ${
                            i === 0 ? 'bg-accent-secondary text-white border-accent-secondary scale-110' : 'bg-black/30 text-slate-400 border-white/10'
                          }`}>
                            <i className={`fas ${s.icon}`}></i>
                          </div>
                          <div className="text-left">
                             <div className={`font-bold text-sm ${i === 0 ? 'text-white' : 'text-slate-400'}`}>{s.status}</div>
                             <div className="text-xxs text-slate-500">{s.time}</div>
                          </div>
                        </div>
                      ))}
                   </div>
                   <button type="button" onClick={() => setStatus('idle')} className="w-full border border-white/10 text-slate-400 font-bold py-3 rounded-control hover:bg-white/5 hover:text-white transition-[background-color,color]">Close Tracker</button>
                </div>
              )}

              {status === 'resetting' && (
                <div className="w-full max-w-[280px] space-y-6">
                  <h3 className="text-xl font-bold text-white">Update Password</h3>
                  <div className="space-y-3">
                    <label htmlFor="email-demo-pw-1" className="sr-only">New password</label>
                    <input id="email-demo-pw-1" type="password" placeholder="New Password" autoComplete="new-password" className="w-full bg-black/30 border border-white/10 text-white rounded-control px-4 py-3 outline-none focus:ring-2 focus:ring-accent-secondary/40 focus:border-accent-secondary transition-[border-color,box-shadow] placeholder:text-slate-500" />
                    <label htmlFor="email-demo-pw-2" className="sr-only">Confirm password</label>
                    <input id="email-demo-pw-2" type="password" placeholder="Confirm Password" autoComplete="new-password" className="w-full bg-black/30 border border-white/10 text-white rounded-control px-4 py-3 outline-none focus:ring-2 focus:ring-accent-secondary/40 focus:border-accent-secondary transition-[border-color,box-shadow] placeholder:text-slate-500" />
                  </div>
                  <button type="button" onClick={() => setStatus('verified')} className="w-full bg-accent-secondary hover:bg-accent-secondary-dark text-white font-bold py-4 rounded-control shadow-lg transition-colors">Save New Password</button>
                </div>
              )}

              {(status === 'sent' && activeScenario !== '2fa') && (
                <div className="space-y-6">
                   <div aria-hidden="true" className="w-16 h-16 bg-accent-secondary/15 text-accent-secondary ring-1 ring-accent-secondary/30 rounded-card flex items-center justify-center text-2xl mx-auto">
                    <i className="fas fa-paper-plane"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white">Email Dispatched</h3>
                  <p className="text-sm text-slate-400 max-w-[200px]">Interact with the <b>Live HTML Preview</b> to continue the workflow.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Live HTML Preview */}
        <div className="flex flex-col space-y-4 h-full">
           <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <i aria-hidden="true" className="fas fa-laptop-code text-accent-secondary"></i>
              Live HTML Preview
            </h3>
            {htmlPreview && <span className="text-xxs text-accent font-bold flex items-center gap-1"><i aria-hidden="true" className="fas fa-circle text-[6px]"></i> Rendered from SMTP Payload</span>}
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm rounded-card-lg border border-white/10 overflow-hidden shadow-2xl flex-grow min-h-[500px] flex flex-col relative">
            {!htmlPreview ? (
              <div className="flex-grow flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                <div aria-hidden="true" className="w-20 h-20 rounded-pill bg-accent-secondary/10 ring-1 ring-accent-secondary/20 flex items-center justify-center mb-4">
                  <i className="fas fa-envelope-open-text text-3xl text-accent-secondary/60"></i>
                </div>
                <p className="text-sm italic text-slate-400">Complete the form to generate and view the raw HTML email template.</p>
              </div>
            ) : (
              <div className="flex-grow flex flex-col h-full">
                <div className="bg-black/40 border-b border-white/10 px-6 py-3 flex items-center gap-4">
                  <div className="flex gap-1.5" aria-hidden="true">
                    <div className="w-2.5 h-2.5 rounded-pill bg-danger/60"></div>
                    <div className="w-2.5 h-2.5 rounded-pill bg-warn/60"></div>
                    <div className="w-2.5 h-2.5 rounded-pill bg-positive/60"></div>
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-control px-3 py-1 text-xxs text-slate-400 flex-grow truncate">
                    Subject: {activeScenario === '2fa' ? 'Verification Code' : activeScenario === 'order' ? 'Order Confirmation' : activeScenario === 'password-reset' ? 'Password Reset' : 'Quote Request'}
                  </div>
                </div>

                <div className="flex-grow relative overflow-auto bg-black/30 p-4">
                   <div className="bg-white shadow-2xl rounded-control overflow-hidden transform scale-90 origin-top">
                      {/* We use an iframe or dangerouslySetInnerHTML. For demo purposes, we'll use a div and intercept clicks. */}
                      <div 
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (target.innerText.includes('Track Package')) {
                            e.preventDefault();
                            setStatus('tracking');
                          } else if (target.innerText.includes('Reset Password')) {
                            e.preventDefault();
                            setStatus('resetting');
                          }
                        }}
                        dangerouslySetInnerHTML={{ __html: htmlPreview }} 
                      />
                   </div>
                   
                   <div className="absolute bottom-4 left-4 right-4 bg-accent-secondary-dark/90 backdrop-blur-md p-3 rounded-control border border-white/10 flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <i aria-hidden="true" className="fas fa-mouse-pointer animate-pulse text-accent-secondary"></i>
                        <span className="text-xxs font-medium italic opacity-80 underline decoration-accent-secondary underline-offset-4">Interactive Preview: Click the buttons inside the email!</span>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
