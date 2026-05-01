'use client';

import { useState } from 'react';
import Link from 'next/link';

type Role = 'admin' | 'user' | 'guest';
type AuthView = 'login' | 'register' | 'forgot' | '2fa' | 'dashboard' | 'new-password';
type TwoFAMethod = 'email' | 'totp';
type TwoFASettings = { email: boolean; totp: boolean; totpSecret: string | null };

const INITIAL_USERS: Record<Role, { email: string; pass: string; name: string; icon: string }> = {
  admin: { email: 'admin@sweetbytes.com', pass: 'admin123', name: 'Sarah Mitchell', icon: 'fa-user-shield' },
  user: { email: 'user@example.com', pass: 'user123', name: 'Alex Rivera', icon: 'fa-user' },
  guest: { email: 'guest@demo.com', pass: 'guest', name: 'Guest Viewer', icon: 'fa-eye' },
};

function Switch({ on, accent = 'emerald' }: { on: boolean; accent?: 'emerald' | 'indigo' | 'amber' }) {
  const onColor = accent === 'indigo' ? 'bg-indigo-600' : accent === 'amber' ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <span
      className={`relative inline-flex flex-shrink-0 w-12 h-7 rounded-full transition-colors duration-200 shadow-inner ${on ? onColor : 'bg-slate-300'}`}
      aria-hidden="true"
    >
      <span
        className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200"
        style={{ transform: on ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </span>
  );
}

const ROLE_META: Record<Role, { label: string; color: string; perms: string[] }> = {
  admin: { label: 'Administrator', color: 'emerald', perms: ['Full Dashboard', 'User Management', 'System Settings', 'Audit Logs', 'API Keys'] },
  user: { label: 'Standard User', color: 'indigo', perms: ['View Dashboard', 'Edit Profile', 'Place Orders', 'View Invoices'] },
  guest: { label: 'Guest Viewer', color: 'slate', perms: ['View Public Pages', 'Browse Catalog'] },
};

export default function AuthDemoPage() {
  // Mutable user data (passwords can change during the session)
  const [users, setUsers] = useState({ ...INITIAL_USERS });

  const [view, setView] = useState<AuthView>('login');
  const [role, setRole] = useState<Role>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedInRole, setLoggedInRole] = useState<Role | null>(null);

  // 2FA
  const [twoFACode, setTwoFACode] = useState('');
  const [expectedCode, setExpectedCode] = useState('');
  const [sending2FA, setSending2FA] = useState(false);
  const [twoFAEmail, setTwoFAEmail] = useState('');
  const [twoFAMethod, setTwoFAMethod] = useState<TwoFAMethod>('email');

  // Per-role 2FA settings (admin defaults to email-2FA on, matching prior behavior)
  const [twoFA, setTwoFA] = useState<Record<'admin' | 'user', TwoFASettings>>({
    admin: { email: true, totp: false, totpSecret: null },
    user: { email: false, totp: false, totpSecret: null },
  });

  // TOTP enrollment flow (inside dashboard)
  const [totpEnroll, setTotpEnroll] = useState<{ role: 'admin' | 'user'; secret: string; qr: string } | null>(null);
  const [totpEnrollCode, setTotpEnrollCode] = useState('');
  const [totpEnrollError, setTotpEnrollError] = useState('');
  const [totpEnrollLoading, setTotpEnrollLoading] = useState(false);
  const [verifyingTotp, setVerifyingTotp] = useState(false);

  // Password Reset
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  // Email Preview
  const [emailPreviewHtml, setEmailPreviewHtml] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Registration
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // New Password (after reset)
  const [newPass, setNewPass] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');
  const [passResetDone, setPassResetDone] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = users[role];
    if (email === user.email && password === user.pass) {
      if (role === 'admin' || role === 'user') {
        const settings = twoFA[role];
        const needsTotp = settings.totp && settings.totpSecret;
        const needsEmail = settings.email;
        if (needsTotp || needsEmail) {
          setView('2fa');
          setTwoFAEmail(email);
          setTwoFACode('');
          setExpectedCode('');
          setTwoFAMethod(needsTotp ? 'totp' : 'email');
          return;
        }
      }
      setLoggedInRole(role);
      setView('dashboard');
    } else {
      setError('Invalid credentials. Check the hint card below.');
    }
  };

  const send2FACode = async () => {
    if (!twoFAEmail) return;
    setSending2FA(true);
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: '2fa', email: twoFAEmail, name: users[role].name }),
      });
      const data = await res.json();
      if (data.code) setExpectedCode(data.code);
      if (data.html) { setEmailPreviewHtml(data.html); setShowPreview(true); }
    } catch { /* ignore */ } finally { setSending2FA(false); }
  };

  const verify2FA = async () => {
    setError('');
    if (twoFAMethod === 'totp') {
      const secret = role !== 'guest' ? twoFA[role].totpSecret : null;
      if (!secret) { setError('No authenticator enrolled for this account.'); return; }
      setVerifyingTotp(true);
      try {
        const res = await fetch('/api/auth/totp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret, token: twoFACode }),
        });
        const data = await res.json();
        if (data.valid) {
          setLoggedInRole(role);
          setView('dashboard');
          setShowPreview(false);
        } else {
          setError('Invalid authenticator code. Try again — codes refresh every 30s.');
        }
      } catch { setError('Verification failed. Try again.'); } finally { setVerifyingTotp(false); }
      return;
    }
    if (twoFACode === expectedCode) {
      setLoggedInRole(role);
      setView('dashboard');
      setShowPreview(false);
    } else {
      setError('Invalid code. Check your email or the preview panel.');
    }
  };

  const startTotpEnrollment = async (targetRole: 'admin' | 'user') => {
    setTotpEnrollError('');
    setTotpEnrollCode('');
    setTotpEnrollLoading(true);
    try {
      const res = await fetch('/api/auth/totp/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: users[targetRole].email, label: `${users[targetRole].name} (${targetRole})` }),
      });
      const data = await res.json();
      if (data.secret && data.qr) {
        setTotpEnroll({ role: targetRole, secret: data.secret, qr: data.qr });
      } else {
        setTotpEnrollError(data.error || 'Failed to start enrollment.');
      }
    } catch { setTotpEnrollError('Failed to start enrollment.'); } finally { setTotpEnrollLoading(false); }
  };

  const confirmTotpEnrollment = async () => {
    if (!totpEnroll) return;
    setTotpEnrollError('');
    setTotpEnrollLoading(true);
    try {
      const res = await fetch('/api/auth/totp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: totpEnroll.secret, token: totpEnrollCode }),
      });
      const data = await res.json();
      if (data.valid) {
        setTwoFA(prev => ({
          ...prev,
          [totpEnroll.role]: { ...prev[totpEnroll.role], totp: true, totpSecret: totpEnroll.secret },
        }));
        setTotpEnroll(null);
        setTotpEnrollCode('');
      } else {
        setTotpEnrollError('Code did not match. Wait for the next 30s window and try again.');
      }
    } catch { setTotpEnrollError('Verification failed.'); } finally { setTotpEnrollLoading(false); }
  };

  const disableTotp = (targetRole: 'admin' | 'user') => {
    setTwoFA(prev => ({ ...prev, [targetRole]: { ...prev[targetRole], totp: false, totpSecret: null } }));
  };

  const toggleEmail2FA = (targetRole: 'admin' | 'user') => {
    setTwoFA(prev => ({ ...prev, [targetRole]: { ...prev[targetRole], email: !prev[targetRole].email } }));
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingReset(true);
    // Find which role this email belongs to
    const matchedRole = (['admin', 'user'] as Role[]).find(r => users[r].email === resetEmail);
    const userName = matchedRole ? users[matchedRole].name : 'User';
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'password-reset', email: resetEmail, name: userName }),
      });
      const data = await res.json();
      if (data.html) { setEmailPreviewHtml(data.html); setShowPreview(true); }
      setResetSent(true);
    } catch { /* ignore */ } finally { setSendingReset(false); }
  };

  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPass.length < 4) { setError('Password must be at least 4 characters.'); return; }
    if (newPass !== newPassConfirm) { setError('Passwords do not match.'); return; }
    // Actually update the password in local state
    const matchedRole = (['admin', 'user'] as Role[]).find(r => users[r].email === resetEmail);
    if (matchedRole) {
      setUsers(prev => ({ ...prev, [matchedRole]: { ...prev[matchedRole], pass: newPass } }));
    }
    setPassResetDone(true);
  };

  const logout = () => {
    setView('login');
    setLoggedInRole(null);
    setEmail('');
    setPassword('');
    setTwoFACode('');
    setExpectedCode('');
    setError('');
    setShowPreview(false);
    setResetSent(false);
    setRegSuccess(false);
    setRegName(''); setRegEmail(''); setRegPassword(''); setRegConfirm('');
    setNewPass(''); setNewPassConfirm(''); setPassResetDone(false);
    setTotpEnroll(null); setTotpEnrollCode(''); setTotpEnrollError('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (regPassword !== regConfirm) { setError('Passwords do not match.'); return; }
    if (regPassword.length < 4) { setError('Password must be at least 4 characters.'); return; }
    // Send welcome email
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'order', email: regEmail, name: regName }),
      });
      const data = await res.json();
      if (data.html) { setEmailPreviewHtml(data.html); setShowPreview(true); }
    } catch { /* ignore */ }
    setRegSuccess(true);
  };

  const autofill = (r: Role) => {
    setRole(r);
    setEmail(users[r].email);
    setPassword(users[r].pass);
    setError('');
  };

  const meta = ROLE_META[role];
  const colorMap: Record<string, string> = {
    emerald: 'from-emerald-600 to-teal-700',
    indigo: 'from-indigo-500 to-blue-600',
    slate: 'from-slate-500 to-gray-600',
  };

  return (
    <main className="min-h-screen bg-surface-deep text-white font-sans selection:bg-indigo-500/30">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 lg:pt-32 pb-10 sm:pb-20 lg:pb-28">
        {/* Header */}
        <div className="mb-8 sm:mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-1">Auth <span className="text-slate-500">Security</span></h1>
            <p className="text-slate-400 font-medium text-xs sm:text-base">Multi-role login, 2FA, and password reset flows.</p>
          </div>
          <Link href="/demo" className="bg-white/5 hover:bg-white/10 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/10 transition-all flex items-center gap-2 font-bold text-xs sm:text-sm">
            <i className="fas fa-arrow-left text-xs"></i>
            <span className="hidden sm:inline">Exit Demo</span><span className="sm:hidden">Back</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 items-start">
          {/* Left Panel: Auth Form */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            {view === 'dashboard' && loggedInRole ? (
              /* ---- DASHBOARD ---- */
              <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-card sm:rounded-card-lg overflow-hidden shadow-2xl">
                <div className={`bg-gradient-to-r ${colorMap[ROLE_META[loggedInRole].color]} p-6 sm:p-8 text-white`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><i className={`fas ${users[loggedInRole].icon} text-xl text-white`}></i></div>
                    <div>
                      <div className="text-lg sm:text-xl font-black">{users[loggedInRole].name}</div>
                      <div className="text-white/70 text-xs font-bold uppercase tracking-widest">{ROLE_META[loggedInRole].label}</div>
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-8 space-y-6">
                  <div>
                    <p className="text-xxs font-black text-slate-300 uppercase tracking-widest mb-3">Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {ROLE_META[loggedInRole].perms.map(p => (
                        <span key={p} className="bg-white/5 text-slate-200 border border-white/10 px-3 py-1.5 rounded-pill text-xxs font-bold"><i aria-hidden="true" className="fas fa-check text-accent mr-1.5"></i>{p}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-control p-4 border border-white/10">
                    <p className="text-xxs font-black text-slate-300 uppercase tracking-widest mb-2">Session Info</p>
                    <div className="text-xs text-slate-300 space-y-1 font-medium">
                      <p>Email: <strong className="text-white">{users[loggedInRole].email}</strong></p>
                      <p>Logged in: <strong className="text-white">{new Date().toLocaleTimeString()}</strong></p>
                      <p>Status: <span className="text-accent font-bold">● Active</span></p>
                    </div>
                  </div>
                  {loggedInRole === 'admin' && (
                    <div className="bg-accent/10 border border-accent/20 rounded-control p-4">
                      <p className="text-xxs font-black text-accent uppercase tracking-widest mb-2"><i aria-hidden="true" className="fas fa-shield-halved mr-1"></i>Admin Panel</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['Users: 1,284', 'Revenue: $48.2k', 'Orders: 326', 'Uptime: 99.9%'].map(s => (
                          <div key={s} className="bg-black/40 rounded-control p-3 text-center border border-white/10">
                            <div className="text-white font-black text-sm">{s.split(': ')[1]}</div>
                            <div className="text-slate-400 text-xxs font-bold uppercase">{s.split(': ')[0]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(loggedInRole === 'admin' || loggedInRole === 'user') && (
                    <div className="bg-black/30 border border-white/10 rounded-card p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-control bg-white/10 text-white flex items-center justify-center" aria-hidden="true"><i className="fas fa-shield-halved text-xxs"></i></div>
                          <p className="text-xxs font-black text-slate-200 uppercase tracking-widest">2FA Settings</p>
                        </div>
                        <span className={`text-xxs font-black uppercase tracking-widest px-2.5 py-1 rounded-pill inline-flex items-center gap-1.5 ${(twoFA[loggedInRole].email || twoFA[loggedInRole].totp) ? 'bg-accent text-white' : 'bg-white/10 text-slate-400'}`}>
                          <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-pill ${(twoFA[loggedInRole].email || twoFA[loggedInRole].totp) ? 'bg-white' : 'bg-slate-400'}`}></span>
                          {(twoFA[loggedInRole].email || twoFA[loggedInRole].totp) ? 'Protected' : 'Unprotected'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleEmail2FA(loggedInRole)}
                        aria-pressed={twoFA[loggedInRole].email}
                        className={`w-full bg-black/40 rounded-control p-3 border transition-[border-color,background-color,box-shadow] cursor-pointer flex items-center justify-between mb-2 text-left hover:bg-black/50 ${twoFA[loggedInRole].email ? 'border-warn/50 ring-1 ring-warn/20' : 'border-white/10'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div aria-hidden="true" className={`w-10 h-10 rounded-control flex items-center justify-center transition-colors ${twoFA[loggedInRole].email ? 'bg-warn text-white' : 'bg-warn/10 text-warn'}`}>
                            <i className="fas fa-envelope text-sm"></i>
                          </div>
                          <div>
                            <p className="text-white text-xs font-black">Email Code</p>
                            <p className={`text-xxs font-medium ${twoFA[loggedInRole].email ? 'text-warn' : 'text-slate-400'}`}>
                              {twoFA[loggedInRole].email ? '✓ Active — code sent on login' : '6-digit code via email'}
                            </p>
                          </div>
                        </div>
                        <Switch on={twoFA[loggedInRole].email} accent="amber" />
                      </button>

                      <button
                        type="button"
                        onClick={() => twoFA[loggedInRole].totp ? disableTotp(loggedInRole) : startTotpEnrollment(loggedInRole)}
                        aria-pressed={twoFA[loggedInRole].totp}
                        disabled={totpEnrollLoading}
                        className={`w-full bg-black/40 rounded-control p-3 border transition-[border-color,background-color,box-shadow] cursor-pointer flex items-center justify-between text-left hover:bg-black/50 disabled:opacity-60 ${twoFA[loggedInRole].totp ? 'border-accent-secondary/50 ring-1 ring-accent-secondary/20' : 'border-white/10'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div aria-hidden="true" className={`w-10 h-10 rounded-control flex items-center justify-center transition-colors ${twoFA[loggedInRole].totp ? 'bg-accent-secondary text-white' : 'bg-accent-secondary/10 text-accent-secondary'}`}>
                            <i className="fas fa-mobile-screen-button text-sm"></i>
                          </div>
                          <div>
                            <p className="text-white text-xs font-black">Google Authenticator</p>
                            <p className={`text-xxs font-medium ${twoFA[loggedInRole].totp ? 'text-accent-secondary' : 'text-slate-400'}`}>
                              {totpEnrollLoading ? 'Loading…' : twoFA[loggedInRole].totp ? '✓ Enrolled — TOTP active' : 'Scan QR to enroll'}
                            </p>
                          </div>
                        </div>
                        <Switch on={twoFA[loggedInRole].totp} accent="indigo" />
                      </button>

                      {totpEnroll && totpEnroll.role === loggedInRole && (
                        <div className="mt-3 bg-black/40 rounded-control p-4 border-2 border-accent-secondary/40">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-white text-xs font-black">Enroll Authenticator</p>
                              <p className="text-slate-400 text-xxs font-medium">Scan with Google Authenticator, Authy, or 1Password</p>
                            </div>
                            <button type="button" aria-label="Close enrollment" onClick={() => { setTotpEnroll(null); setTotpEnrollCode(''); setTotpEnrollError(''); }} className="text-slate-400 hover:text-white"><i aria-hidden="true" className="fas fa-times"></i></button>
                          </div>
                          <div className="flex flex-col items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={totpEnroll.qr} alt="TOTP QR code" className="w-44 h-44 rounded-control bg-white p-2 border border-white/20" />
                            <div className="w-full bg-black/40 rounded-control p-2 border border-white/10">
                              <p className="text-xxs font-black text-slate-300 uppercase tracking-widest mb-1 text-center">Or enter manually</p>
                              <code className="block text-center text-xxs text-slate-200 font-mono break-all select-all">{totpEnroll.secret}</code>
                            </div>
                            <input
                              type="text" inputMode="numeric" maxLength={6}
                              value={totpEnrollCode}
                              onChange={e => { setTotpEnrollCode(e.target.value.replace(/\D/g, '')); setTotpEnrollError(''); }}
                              placeholder="000000"
                              className="w-full px-4 py-3 rounded-control border border-white/10 bg-black/30 text-white placeholder:text-slate-500 text-center text-xl font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                            {totpEnrollError && <p className="text-red-500 text-xxs font-bold text-center"><i className="fas fa-exclamation-circle mr-1"></i>{totpEnrollError}</p>}
                            <button
                              onClick={confirmTotpEnrollment}
                              disabled={totpEnrollCode.length < 6 || totpEnrollLoading}
                              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm disabled:opacity-40 transition-all">
                              {totpEnrollLoading ? <><i className="fas fa-spinner animate-spin mr-1"></i>Verifying…</> : <><i className="fas fa-check mr-1"></i>Verify & Enable</>}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button onClick={logout} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black transition-all flex items-center justify-center gap-2">
                    <i className="fas fa-right-from-bracket"></i> Sign Out
                  </button>
                </div>
              </div>
            ) : view === '2fa' ? (
              /* ---- 2FA ---- */
              <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-card sm:rounded-card-lg shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white text-center">
                  <i className={`fas ${twoFAMethod === 'totp' ? 'fa-mobile-screen-button' : 'fa-shield-halved'} text-3xl mb-2`}></i>
                  <h2 className="text-xl font-black">Two-Factor Authentication</h2>
                  <p className="text-white/70 text-xs font-medium mt-1">{twoFAMethod === 'totp' ? 'Open Google Authenticator for the 6-digit code' : 'Verify with a one-time code sent by email'}</p>
                </div>
                <div className="p-5 sm:p-8 space-y-5">
                  {role !== 'guest' && twoFA[role].totp && twoFA[role].email && (
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => { setTwoFAMethod('totp'); setTwoFACode(''); setError(''); }} className={`py-2.5 rounded-control text-xxs font-black uppercase tracking-widest cursor-pointer transition-[background-color,color,border-color] border ${twoFAMethod === 'totp' ? 'bg-white text-slate-900 border-transparent' : 'bg-black/30 text-slate-300 border-white/10 hover:bg-black/50'}`}>
                        <i aria-hidden="true" className="fas fa-mobile-screen-button mr-1"></i> Authenticator
                      </button>
                      <button type="button" onClick={() => { setTwoFAMethod('email'); setTwoFACode(''); setError(''); }} className={`py-2.5 rounded-control text-xxs font-black uppercase tracking-widest cursor-pointer transition-[background-color,color,border-color] border ${twoFAMethod === 'email' ? 'bg-white text-slate-900 border-transparent' : 'bg-black/30 text-slate-300 border-white/10 hover:bg-black/50'}`}>
                        <i aria-hidden="true" className="fas fa-envelope mr-1"></i> Email
                      </button>
                    </div>
                  )}

                  {twoFAMethod === 'email' ? (
                    <>
                      <p className="text-slate-400 text-sm font-medium text-center">Enter your email to receive a 6-digit verification code.</p>
                      <div>
                        <label className="text-xxs font-black text-slate-300 uppercase tracking-widest block mb-2">Email for Code</label>
                        <div className="flex gap-2">
                          <input type="email" value={twoFAEmail} onChange={e => setTwoFAEmail(e.target.value)} placeholder="admin@sweetbytes.com" className="flex-1 px-4 py-3 rounded-control border border-white/10 bg-black/30 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300" />
                          <button onClick={send2FACode} disabled={sending2FA || !twoFAEmail} className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm disabled:opacity-40 transition-all whitespace-nowrap">
                            {sending2FA ? <i className="fas fa-spinner animate-spin"></i> : <><i className="fas fa-paper-plane mr-1"></i>Send</>}
                          </button>
                        </div>
                      </div>
                      {expectedCode && (
                        <div>
                          <label className="text-xxs font-black text-slate-300 uppercase tracking-widest block mb-2">Enter 6-Digit Code</label>
                          <input type="text" inputMode="numeric" maxLength={6} value={twoFACode} onChange={e => { setTwoFACode(e.target.value); setError(''); }} placeholder="000000" className="w-full px-4 py-4 rounded-control border border-white/10 bg-black/30 text-white placeholder:text-slate-500 text-center text-2xl font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-warn/50" />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-slate-400 text-sm font-medium text-center">Open Google Authenticator (or any TOTP app) and enter the current 6-digit code for <strong className="text-white">{users[role as 'admin' | 'user']?.name}</strong>.</p>
                      <div>
                        <label className="text-xxs font-black text-slate-300 uppercase tracking-widest block mb-2">Authenticator Code</label>
                        <input autoFocus type="text" inputMode="numeric" maxLength={6} value={twoFACode} onChange={e => { setTwoFACode(e.target.value.replace(/\D/g, '')); setError(''); }} placeholder="000000" className="w-full px-4 py-4 rounded-control border border-white/10 bg-black/30 text-white placeholder:text-slate-500 text-center text-2xl font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-warn/50" />
                      </div>
                    </>
                  )}

                  {error && <p className="text-red-500 text-xs font-bold text-center"><i className="fas fa-exclamation-circle mr-1"></i>{error}</p>}
                  <button onClick={verify2FA} disabled={twoFACode.length < 6 || verifyingTotp} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black disabled:opacity-40 transition-all">
                    {verifyingTotp ? <><i className="fas fa-spinner animate-spin mr-2"></i>Verifying…</> : <><i className="fas fa-lock-open mr-2"></i>Verify & Login</>}
                  </button>
                  <button onClick={() => { setView('login'); setError(''); }} className="w-full text-center text-slate-400 text-xs font-bold hover:text-white transition-colors">
                    ← Back to Login
                  </button>
                </div>
              </div>
            ) : view === 'forgot' ? (
              /* ---- FORGOT PASSWORD ---- */
              <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-card sm:rounded-card-lg shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white text-center">
                  <i className="fas fa-key text-3xl mb-2"></i>
                  <h2 className="text-xl font-black">Reset Password</h2>
                  <p className="text-white/70 text-xs font-medium mt-1">We&apos;ll send a reset link to your email</p>
                </div>
                <div className="p-5 sm:p-8 space-y-5">
                  {resetSent ? (
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-accent/15 ring-1 ring-accent/30 rounded-pill flex items-center justify-center mx-auto"><i className="fas fa-check text-2xl text-emerald-500"></i></div>
                      <h3 className="text-white font-black text-lg">Email Sent!</h3>
                      <p className="text-slate-400 text-sm font-medium">Check your inbox (and the email preview panel) for the reset link.</p>
                      <button onClick={() => { setView('new-password'); }} className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black transition-all flex items-center justify-center gap-2">
                        <i className="fas fa-lock"></i> Set New Password
                      </button>
                      <button onClick={() => { setView('login'); setResetSent(false); }} className="text-slate-400 text-xs font-bold hover:text-white transition-colors">← Back to Login</button>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <div>
                        <label className="text-xxs font-black text-slate-300 uppercase tracking-widest block mb-2">Your Email Address</label>
                        <input type="email" required value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 rounded-control border border-white/10 bg-black/30 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                      </div>
                      <button type="submit" disabled={sendingReset} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black disabled:opacity-40 transition-all flex items-center justify-center gap-2">
                        {sendingReset ? <i className="fas fa-spinner animate-spin"></i> : <><i className="fas fa-envelope mr-1"></i>Send Reset Link</>}
                      </button>
                      <button type="button" onClick={() => setView('login')} className="w-full text-center text-slate-400 text-xs font-bold hover:text-white transition-colors">← Back to Login</button>
                    </form>
                  )}
                </div>
              </div>
            ) : view === 'new-password' ? (
              /* ---- SET NEW PASSWORD ---- */
              <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-card sm:rounded-card-lg shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white text-center">
                  <i className="fas fa-lock-open text-3xl mb-2"></i>
                  <h2 className="text-xl font-black">Set New Password</h2>
                  <p className="text-white/70 text-xs font-medium mt-1">Create a new password for your account</p>
                </div>
                <div className="p-5 sm:p-8 space-y-5">
                  {passResetDone ? (
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-accent/15 ring-1 ring-accent/30 rounded-pill flex items-center justify-center mx-auto"><i className="fas fa-circle-check text-2xl text-emerald-500"></i></div>
                      <h3 className="text-white font-black text-lg">Password Updated!</h3>
                      <p className="text-slate-400 text-sm font-medium">Your password has been successfully changed. You can now sign in.</p>
                      <button onClick={() => { setView('login'); setPassResetDone(false); setResetSent(false); }} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black transition-all flex items-center justify-center gap-2 mt-2">
                        <i className="fas fa-right-to-bracket"></i> Go to Login
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSetNewPassword} className="space-y-4">
                      <div className="bg-black/30 rounded-control p-3 border border-white/10">
                        <p className="text-slate-300 text-xs font-medium"><i aria-hidden="true" className="fas fa-envelope mr-1.5 text-slate-400"></i>Resetting for: <strong className="text-white">{resetEmail}</strong></p>
                      </div>
                      <div>
                        <label className="text-xxs font-black text-slate-300 uppercase tracking-widest block mb-2">New Password</label>
                        <input type="password" required value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-control border border-white/10 bg-black/30 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder:text-slate-400" />
                      </div>
                      <div>
                        <label className="text-xxs font-black text-slate-300 uppercase tracking-widest block mb-2">Confirm New Password</label>
                        <input type="password" required value={newPassConfirm} onChange={e => setNewPassConfirm(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-control border border-white/10 bg-black/30 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder:text-slate-400" />
                      </div>
                      {error && <p className="text-red-500 text-xs font-bold"><i className="fas fa-exclamation-circle mr-1"></i>{error}</p>}
                      <button type="submit" className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
                        <i className="fas fa-check"></i> Update Password
                      </button>
                      <button type="button" onClick={() => setView('login')} className="w-full text-center text-slate-400 text-xs font-bold hover:text-white transition-colors">← Back to Login</button>
                    </form>
                  )}
                </div>
              </div>
            ) : view === 'register' ? (
              /* ---- REGISTER ---- */
              <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-card sm:rounded-card-lg shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-6 text-white text-center">
                  <i className="fas fa-user-plus text-3xl mb-2"></i>
                  <h2 className="text-xl font-black">Create Account</h2>
                  <p className="text-white/70 text-xs font-medium mt-1">Register a new user in the sandbox</p>
                </div>
                <div className="p-5 sm:p-8 space-y-5">
                  {regSuccess ? (
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-accent/15 ring-1 ring-accent/30 rounded-pill flex items-center justify-center mx-auto"><i className="fas fa-circle-check text-2xl text-emerald-500"></i></div>
                      <h3 className="text-white font-black text-lg">Account Created!</h3>
                      <p className="text-slate-400 text-sm font-medium">Welcome, <strong>{regName}</strong>. A confirmation email has been sent to <strong>{regEmail}</strong>.</p>
                      <p className="text-slate-400 text-xxs font-medium">Check the email preview panel to see your welcome email.</p>
                      <button onClick={() => { setView('login'); setRegSuccess(false); setEmail(regEmail); setPassword(regPassword); }} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black transition-all flex items-center justify-center gap-2 mt-2">
                        <i className="fas fa-right-to-bracket"></i> Go to Login
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <label className="text-xxs font-black text-slate-300 uppercase tracking-widest block mb-2">Full Name</label>
                        <input type="text" required value={regName} onChange={e => setRegName(e.target.value)} placeholder="Alex Rivera" className="w-full px-4 py-3 rounded-control border border-white/10 bg-black/30 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-300 placeholder:text-slate-400" />
                      </div>
                      <div>
                        <label className="text-xxs font-black text-slate-300 uppercase tracking-widest block mb-2">Email Address</label>
                        <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 rounded-control border border-white/10 bg-black/30 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-300 placeholder:text-slate-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xxs font-black text-slate-300 uppercase tracking-widest block mb-2">Password</label>
                          <input type="password" required value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-control border border-white/10 bg-black/30 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-300 placeholder:text-slate-400" />
                        </div>
                        <div>
                          <label className="text-xxs font-black text-slate-300 uppercase tracking-widest block mb-2">Confirm</label>
                          <input type="password" required value={regConfirm} onChange={e => setRegConfirm(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-control border border-white/10 bg-black/30 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-300 placeholder:text-slate-400" />
                        </div>
                      </div>
                      {error && <p className="text-red-500 text-xs font-bold"><i className="fas fa-exclamation-circle mr-1"></i>{error}</p>}
                      <button type="submit" className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl font-black shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
                        <i className="fas fa-user-plus"></i> Create Account
                      </button>
                      <button type="button" onClick={() => { setView('login'); setError(''); }} className="w-full text-center text-slate-400 text-xs font-bold hover:text-white transition-colors">Already have an account? Sign in ←</button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              /* ---- LOGIN ---- */
              <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-card sm:rounded-card-lg shadow-2xl overflow-hidden">
                <div className={`bg-gradient-to-r ${colorMap[meta.color]} p-6 sm:p-8 text-white text-center`}>
                  <i className={`fas ${role === 'guest' ? 'fa-eye' : 'fa-lock'} text-3xl mb-2`}></i>
                  <h2 className="text-xl sm:text-2xl font-black">{role === 'guest' ? 'Guest Access' : 'Secure Sign In'}</h2>
                  <p className="text-white/70 text-xs font-medium mt-1">{role === 'guest' ? 'Browse with limited permissions' : 'Select a role and log in with sandbox credentials'}</p>
                </div>
                <div className="p-5 sm:p-8 space-y-5">
                  {/* Role Selector */}
                  <div>
                    <p className="text-xxs font-black text-slate-300 uppercase tracking-widest mb-3">Select Role</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(['admin', 'user', 'guest'] as Role[]).map(r => (
                        <button key={r} type="button" onClick={() => autofill(r)} className={`py-3 rounded-control text-xs font-black uppercase tracking-widest cursor-pointer transition-[background-color,border-color,box-shadow,transform] hover:-translate-y-0.5 border ${role === r ? `bg-gradient-to-r ${colorMap[ROLE_META[r].color]} text-white border-transparent shadow-lg` : 'bg-black/30 text-slate-300 border-white/10 hover:border-accent/40 hover:bg-black/50'}`}>
                          <i className={`fas ${users[r].icon} mr-1`}></i> {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {role === 'guest' ? (
                    /* Guest: Continue button instead of login form */
                    <div className="space-y-4">
                      <div className="bg-black/30 rounded-control p-4 border border-white/10 text-center">
                        <p className="text-slate-400 text-sm font-medium">No credentials needed. Guests have <strong className="text-white">read-only</strong> access to public pages and catalog.</p>
                      </div>
                      <button onClick={() => { setLoggedInRole('guest'); setView('dashboard'); }} className="w-full py-4 bg-gradient-to-r from-slate-500 to-gray-600 text-white rounded-xl font-black shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
                        <i className="fas fa-eye"></i> Continue as Guest
                      </button>
                    </div>
                  ) : (
                    /* Admin/User: Full login form */
                    <>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <label className="text-xxs font-black text-slate-300 uppercase tracking-widest block mb-2">Email</label>
                          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-control border border-white/10 bg-black/30 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder:text-slate-400" placeholder="admin@sweetbytes.com" />
                        </div>
                        <div>
                          <label className="text-xxs font-black text-slate-300 uppercase tracking-widest block mb-2">Password</label>
                          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-control border border-white/10 bg-black/30 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder:text-slate-400" placeholder="••••••••" />
                        </div>
                        {error && <p className="text-red-500 text-xs font-bold"><i className="fas fa-exclamation-circle mr-1"></i>{error}</p>}
                        <button type="submit" className={`w-full py-4 bg-gradient-to-r ${colorMap[meta.color]} text-white rounded-xl font-black shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2`}>
                          <i className="fas fa-right-to-bracket"></i> Sign In as {meta.label}
                        </button>
                      </form>
                      <div className="flex items-center justify-between">
                        <button onClick={() => { setView('forgot'); setResetEmail(email || users[role].email); }} className="text-indigo-500 text-xs font-bold hover:underline">Forgot password?</button>
                        <button onClick={() => setView('register')} className="text-slate-400 text-xs font-bold hover:text-slate-600">Create account →</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Credentials Hint */}
            {(view === 'login' || view === 'register') && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 sm:p-5">
                <p className="text-xxs font-black text-amber-300 uppercase tracking-widest mb-3"><i className="fas fa-flask mr-2"></i>Sandbox Credentials</p>
                <div className="space-y-2">
                  {(['admin', 'user', 'guest'] as Role[]).map(r => (
                    <div key={r} className="flex items-center justify-between text-xs">
                      <span className="text-amber-200/60 font-bold uppercase tracking-wider">{r}</span>
                      <code className="text-amber-200 font-bold bg-amber-500/10 px-2 py-0.5 rounded">{users[r].email} / {users[r].pass}</code>
                    </div>
                  ))}
                </div>
                <p className="text-amber-400/50 text-xxs mt-3 font-medium">2FA toggles live in the dashboard — enroll Google Authenticator or enable email codes per role. All data resets on page refresh.</p>
              </div>
            )}
          </div>

          {/* Right Panel: Email Preview + Info */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Live Email Preview */}
            <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-card sm:rounded-card-lg shadow-2xl overflow-hidden">
              <div className="bg-slate-900 px-5 sm:px-6 py-3 flex items-center gap-3">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-amber-400"></div><div className="w-3 h-3 rounded-full bg-emerald-400"></div></div>
                <div className="flex-1 bg-slate-800 rounded-lg px-3 py-1.5 text-xxs text-slate-400 font-mono truncate">
                  {showPreview ? '📧 mail.sweetbytesbakery.com — Incoming Email' : '📭 No email received yet'}
                </div>
                {showPreview && <button onClick={() => setShowPreview(false)} className="text-slate-500 hover:text-white text-xs"><i className="fas fa-times"></i></button>}
              </div>
              <div className="bg-slate-950 min-h-[300px] sm:min-h-[400px]">
                {showPreview ? (
                  <iframe srcDoc={emailPreviewHtml} className="w-full min-h-[400px] sm:min-h-[500px] border-0" title="Email Preview" sandbox="allow-same-origin" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] text-center px-6">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4"><i className="fas fa-inbox text-3xl text-slate-400"></i></div>
                    <h3 className="text-slate-200 font-black text-lg mb-1">Inbox Empty</h3>
                    <p className="text-slate-400 text-sm font-medium max-w-xs">Trigger a 2FA login or password reset to see a live email preview appear here.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: 'fa-user-shield', title: 'Role-Based Access', desc: 'Admin, User, and Guest roles with scoped permissions.' },
                { icon: 'fa-shield-halved', title: 'Two-Factor Auth', desc: 'Real 6-digit codes sent to your email via SMTP.' },
                { icon: 'fa-key', title: 'Password Reset', desc: 'Branded reset emails with secure token links.' },
              ].map(f => (
                <div key={f.title} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <i className={`fas ${f.icon} text-indigo-400 text-lg mb-2`}></i>
                  <h4 className="text-white font-black text-sm mb-1">{f.title}</h4>
                  <p className="text-slate-500 text-xxs font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </main>
  );
}
