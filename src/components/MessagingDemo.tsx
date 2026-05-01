'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system' | 'meta' | 'template';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  buttons?: string[];
  replyTo?: string;
  sid?: string;
  mediaUrl?: string;
  isLocation?: boolean;
}

interface TwilioLog {
  id: string;
  timestamp: Date;
  method: string;
  endpoint: string;
  status: number;
  response: any;
}

export default function MessagingDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: "This business is now using a secure service from Meta to manage this chat. Tap to learn more.",
      sender: 'meta',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState<'sms' | 'whatsapp'>('whatsapp');
  const [logs, setLogs] = useState<TwilioLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const logScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (logScrollRef.current) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (method: string, endpoint: string, status: number, response: any) => {
    const newLog: TwilioLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      method,
      endpoint,
      status,
      response
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleSend = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const messageText = overrideText || input;
    if (!messageText.trim() || sending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    if (!overrideText) setInput('');
    setSending(true);

    try {
      const isJoin = messageText.toLowerCase() === 'join require-minute';
      const isConfirm = messageText.toLowerCase() === 'confirm';
      
      const payload: any = {
        to: '+12109972900',
        message: messageText,
        useWhatsApp: mode === 'whatsapp'
      };

      // Apply real template logic if joining
      if (isJoin && mode === 'whatsapp') {
        payload.contentSid = 'HXb5b62575e6e4ff6129ad7c8efe1f983e';
        payload.contentVariables = { "1": "12/1", "2": "3pm" };
      }

      const response = await fetch('/api/messaging/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      addLog('POST', '/api/messaging/send', response.status, data);
      
      if (data.success) {
        setMessages(prev => prev.map(m => m.id === userMessage.id ? { ...m, status: 'delivered', sid: data.sid } : m));
        
        // Custom flow for sandbox mirror
        if (isJoin) {
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              const sandboxSuccess: Message = {
                id: Date.now().toString(),
                text: "Twilio Sandbox: ✅ You are all set! The sandbox can now send/receive messages from whatsapp: +14155238886. Reply stop to leave the sandbox any time.",
                sender: 'system',
                timestamp: new Date(),
                sid: data.sid // Use the SID from the join request
              };
              setMessages(prev => [...prev, sandboxSuccess]);
              setIsTyping(false);

              setTimeout(() => {
                const appointment: Message = {
                  id: (Date.now() + 1).toString(),
                  text: "Your appointment is coming up on 12/1 at 3pm",
                  sender: 'template',
                  timestamp: new Date(),
                  buttons: ['Confirm', 'Cancel']
                };
                setMessages(prev => [...prev, appointment]);
              }, 1000);
            }, 1000);
          }, 500);
        } else {
          // Standard reply
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              const reply: Message = {
                id: (Date.now() + 1).toString(),
                text: isConfirm 
                  ? `You said :Confirm. Configure your WhatsApp Sandbox's Inbound URL to change this message.`
                  : `You said :${messageText}. This demo is using the User-Initiated session window.`,
                sender: 'system',
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, reply]);
              setIsTyping(false);
            }, 1500);
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleAction = async (actionType: 'image' | 'location' | 'template') => {
    if (sending) return;

    let messageText = '';
    let mediaUrl: string | undefined;
    let persistentAction: string[] | undefined;
    let contentSid: string | undefined;

    if (actionType === 'image') {
      messageText = 'Check out this property listing!';
      mediaUrl = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80';
    } else if (actionType === 'location') {
      messageText = 'Here is the open house location:';
      persistentAction = ['geo:37.7749,-122.4194|San Francisco, CA'];
    } else if (actionType === 'template') {
      messageText = 'join require-minute'; // Existing trigger
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: actionType === 'template' ? 'Requesting Appointment...' : messageText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
      mediaUrl: mediaUrl,
      isLocation: actionType === 'location'
    };

    setMessages(prev => [...prev, userMessage]);
    setSending(true);

    try {
      const payload: any = {
        to: '+12109972900',
        message: actionType === 'template' ? 'join require-minute' : messageText,
        useWhatsApp: mode === 'whatsapp',
        mediaUrl: mediaUrl,
        persistentAction: persistentAction
      };

      if (actionType === 'template') {
        payload.contentSid = 'HXb5b62575e6e4ff6129ad7c8efe1f983e';
        payload.contentVariables = { "1": "12/1", "2": "3pm" };
      }

      const response = await fetch('/api/messaging/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      addLog('POST', '/api/messaging/send', response.status, data);

      if (data.success) {
        setMessages(prev => prev.map(m => m.id === userMessage.id ? { ...m, status: mode === 'whatsapp' ? 'read' : 'delivered', sid: data.sid } : m));

        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            const reply: Message = {
              id: (Date.now() + 1).toString(),
              text: actionType === 'image' 
                ? "Wow, that looks great! I'll add it to your file." 
                : actionType === 'location' 
                  ? "Thanks, I've updated the directions in our system."
                  : "Template requested. (Configure your Sandbox Inbound URL to change this)",
              sender: 'system',
              timestamp: new Date(),
            };
            
            if (actionType === 'template') {
               const appointment: Message = {
                  id: (Date.now() + 2).toString(),
                  text: "Your appointment is coming up on 12/1 at 3pm",
                  sender: 'template',
                  timestamp: new Date(),
                  buttons: ['Confirm', 'Cancel']
                };
                setMessages(prev => [...prev, appointment]);
            } else {
               setMessages(prev => [...prev, reply]);
            }
            setIsTyping(false);
          }, 1500);
        }, 1000);
      }
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col items-center gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Phone Simulator Section */}
      <div className="flex flex-col items-center w-full">
        <div className="flex bg-white/5 p-1 rounded-card border border-white/10 mb-8 w-fit shadow-inner" role="tablist" aria-label="Messaging channel">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sms'}
            onClick={() => setMode('sms')}
            className={`px-8 py-2.5 rounded-control text-sm font-bold cursor-pointer transition-[background-color,color,box-shadow,transform] duration-300 ${mode === 'sms' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5 hover:-translate-y-0.5'}`}
          >
            SMS
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'whatsapp'}
            onClick={() => setMode('whatsapp')}
            style={mode === 'whatsapp' ? { backgroundColor: '#25D366' } : undefined}
            className={`px-8 py-2.5 rounded-control text-sm font-bold cursor-pointer transition-[background-color,color,box-shadow,transform] duration-300 ${mode === 'whatsapp' ? 'text-white shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5 hover:-translate-y-0.5'}`}
          >
            WhatsApp
          </button>
        </div>

        <div className="relative bg-slate-900 rounded-[3.5rem] p-4 border-[10px] border-slate-800 shadow-2xl h-[650px] w-full max-w-[380px] flex flex-col overflow-hidden ring-1 ring-white/10">
          {/* Dynamic Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-20"></div>
          
          <div className="pt-10 pb-4 px-6 border-b border-white/5 bg-slate-900/90 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                style={mode === 'whatsapp' ? { backgroundColor: '#25D366' } : undefined}
                className={`w-10 h-10 rounded-pill flex items-center justify-center text-white font-bold shadow-lg ${mode === 'whatsapp' ? '' : 'bg-accent'}`}
              >
                {mode === 'whatsapp' ? 'W' : 'A'}
              </div>
              <div>
                <div className="text-sm font-black text-white">Twilio API Assistant</div>
                <div className="text-xxs text-accent font-bold uppercase tracking-widest flex items-center gap-1" role="status">
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-pill bg-accent animate-pulse"></span>
                  Online
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-hide"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {msg.sender === 'meta' ? (
                  <div className="w-full flex justify-center my-2 px-4 text-center">
                    <div className="bg-accent/5 border border-accent/10 p-3 rounded-card text-xxs text-accent/80 leading-snug">
                      {msg.text}
                    </div>
                  </div>
                ) : msg.sender === 'template' ? (
                  <div className="max-w-[85%] bg-slate-800 rounded-card rounded-tl-none overflow-hidden shadow-2xl border border-white/5">
                    <div className="p-4 text-sm text-slate-200 border-b border-white/5 leading-relaxed">
                      {msg.text}
                    </div>
                    {msg.buttons?.map((btn) => (
                      <button
                        type="button"
                        key={btn}
                        onClick={() => handleSend(undefined, btn)}
                        className="w-full py-3.5 px-4 text-accent text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                      >
                        <svg aria-hidden="true" className="w-4 h-4 opacity-50 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                        {btn}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div
                    style={msg.sender === 'user' && mode === 'whatsapp' ? { backgroundColor: '#056162' } : undefined}
                    className={`max-w-[85%] p-4 rounded-card text-sm leading-relaxed shadow-xl ${
                      msg.sender === 'user'
                        ? (mode === 'whatsapp' ? 'text-white rounded-tr-none' : 'bg-accent text-white rounded-tr-none')
                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'
                    }`}>
                    {msg.mediaUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={msg.mediaUrl} alt="Property listing attachment" className="w-full h-auto rounded-control mb-3 border border-white/10" />
                    )}
                    {msg.isLocation && (
                      <div className="w-full h-32 rounded-control mb-3 border border-white/10 overflow-hidden relative bg-slate-700 flex items-center justify-center" role="img" aria-label="Map showing San Francisco">
                        <div aria-hidden="true" className="absolute inset-0 opacity-50 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=37.7749,-122.4194&zoom=13&size=400x200&sensor=false')] bg-cover bg-center mix-blend-luminosity"></div>
                        <div aria-hidden="true" className="relative z-10 w-8 h-8 text-danger animate-bounce">
                          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                        </div>
                      </div>
                    )}
                    {msg.text}
                    {msg.sid && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-[8px] font-mono text-white/40 truncate">
                        SID: {msg.sid}
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-1.5 flex items-center gap-1.5 text-xxs text-slate-500 font-bold uppercase tracking-tighter px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.sender === 'user' && msg.status && (
                    <span aria-label={`Status: ${msg.status}`} className={msg.status === 'read' ? 'text-accent-secondary' : 'text-slate-400'}>
                      {msg.status === 'delivered' || msg.status === 'read' ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xxs font-bold animate-pulse px-2 uppercase tracking-widest">
                Assistant typing...
              </div>
            )}
          </div>

          <div className="px-4 py-2 bg-slate-900/90 border-t border-white/5 flex gap-2 overflow-x-auto scrollbar-hide" role="toolbar" aria-label="Quick actions">
            <button
              type="button"
              onClick={() => handleAction('image')}
              aria-label="Send image attachment"
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xxs font-bold uppercase tracking-wider rounded-control cursor-pointer transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 border border-white/5 hover:border-white/20"
            >
              <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Send Image
            </button>
            {mode === 'whatsapp' && (
              <>
                <button
                  type="button"
                  onClick={() => handleAction('location')}
                  aria-label="Share location"
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xxs font-bold uppercase tracking-wider rounded-control cursor-pointer transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 border border-white/5 hover:border-white/20"
                >
                  <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Location
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('template')}
                  aria-label="Send interactive template"
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xxs font-bold uppercase tracking-wider rounded-control cursor-pointer transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 border border-white/5 hover:border-white/20"
                >
                  <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                  Interactive
                </button>
              </>
            )}
          </div>

          <div className="p-4 bg-slate-900/90 backdrop-blur-xl border-t border-white/5 pb-6">
            <form onSubmit={handleSend} className="flex gap-2" aria-label="Send message">
              <label htmlFor="messaging-input" className="sr-only">Message</label>
              <input
                id="messaging-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message..."
                className="flex-grow bg-slate-800 border border-white/5 text-white rounded-card px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition-[border-color,box-shadow] placeholder:text-slate-500"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={sending || !input.trim()}
                style={mode === 'whatsapp' ? { backgroundColor: '#25D366' } : undefined}
                className={`w-12 h-12 rounded-card flex items-center justify-center transition-[background-color,box-shadow] shadow-xl shadow-accent/10 disabled:opacity-30 disabled:shadow-none ${
                  mode === 'whatsapp' ? '' : 'bg-accent hover:bg-accent-dark'
                }`}
              >
                <svg aria-hidden="true" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl flex flex-col space-y-4">
        <div className="flex items-center justify-between px-6">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span aria-hidden="true" className="w-2 h-2 rounded-pill bg-accent animate-pulse"></span>
            Twilio API Live Console
          </h3>
          <button
            type="button"
            onClick={() => setLogs([])}
            aria-label="Clear API console"
            className="text-xxs font-bold text-slate-400 hover:text-white uppercase transition-colors flex items-center gap-2"
          >
            <svg aria-hidden="true" className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Clear Console
          </button>
        </div>

        <div
          className="bg-slate-900/90 border border-white/10 rounded-card-lg overflow-hidden shadow-2xl backdrop-blur-2xl ring-1 ring-white/5"
        >
          <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex gap-2" aria-hidden="true">
              <div className="w-3 h-3 rounded-pill bg-danger/50"></div>
              <div className="w-3 h-3 rounded-pill bg-warn/50"></div>
              <div className="w-3 h-3 rounded-pill bg-positive/50"></div>
            </div>
            <div className="text-xxs font-bold text-slate-500 uppercase tracking-[0.2em]">twilio-logs --verbose</div>
            <div className="w-12"></div>
          </div>

          <div
            ref={logScrollRef}
            role="log"
            aria-live="polite"
            aria-label="Twilio API logs"
            className="p-8 h-[350px] overflow-y-auto font-mono text-[12px] scrollbar-hide"
          >
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 italic">
                Awaiting first API interaction...
              </div>
            ) : (
              <div className="space-y-8">
                {logs.map(log => (
                  <div key={log.id} className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-accent font-black">{log.method}</span>
                      <span className="text-slate-300 font-bold">{log.endpoint}</span>
                      <span className={`px-2 py-0.5 rounded-pill text-xxs font-black ${log.status >= 200 && log.status < 300 ? 'bg-accent/20 text-accent' : 'bg-danger/20 text-danger'}`}>
                        HTTP {log.status}
                      </span>
                    </div>
                    <div className="bg-black/20 rounded-card p-6 border border-white/5">
                      <pre className="leading-relaxed whitespace-pre-wrap">
                        {renderHighlightedJson(log.response)}
                      </pre>
                    </div>
                    <div className="mt-3 text-xxs text-slate-600 font-bold px-2">
                      TRANSFERRED AT: {log.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderHighlightedJson(json: any) {
  const content = JSON.stringify(json, null, 2);
  return content.split('\n').map((line, i) => {
    // Basic syntax highlighting logic
    const isKey = line.match(/"(\w+)":/);
    const isString = line.match(/: "(.+)"/);
    const isNumber = line.match(/: (\d+)/);
    const isNull = line.match(/: null/);

    return (
      <div key={i} className="min-h-[1.2rem]">
        {line.split(/(": ")|(": )/).map((part, j) => {
          if (!part) return null;
          if (part.startsWith('"') && part.endsWith('"') && j === 0)
            return <span key={j} className="text-accent">{part}</span>;
          if (part.startsWith('"') && part.endsWith('"'))
            return <span key={j} className="text-amber-200">{part}</span>;
          if (part.match(/^\d+$/) || part === 'null')
            return <span key={j} className="text-accent-secondary">{part}</span>;
          return <span key={j} className="text-slate-400">{part}</span>;
        })}
      </div>
    );
  });
}
