'use client';

import { useState } from 'react';
import Button from './ui/Button';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export default function PdfDemo() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [generating, setGenerating] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const menuItems: MenuItem[] = [
    { id: '1', name: 'Mini Cupcakes (Dozen)', price: 24.00 },
    { id: '2', name: 'Custom Birthday Cake', price: 85.00 },
    { id: '3', name: 'Artisan Pastry Platter', price: 45.00 },
    { id: '4', name: 'Delivery & Setup Fee', price: 25.00 }
  ];

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const generateInvoice = async (sendEmail = false) => {
    if (cart.length === 0 || !customerName) return;

    if (sendEmail) setSendingEmail(true);
    else setGenerating(true);

    try {
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customerName,
          customerEmail: customerEmail || 'guest@example.com',
          invoiceNumber: 'INV-' + Math.floor(1000 + Math.random() * 9000),
          date: new Date().toLocaleDateString(),
          sendEmail
        })
      });

      if (response.ok) {
        if (sendEmail) {
          alert(`Success! The professional invoice has been generated and sent to ${customerEmail}.`);
        } else {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Invoice-${customerName.replace(/\s+/g, '-')}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        }
      } else {
        const data = await response.json();
        alert('Error: ' + (data.error || 'Failed to process request'));
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to service');
    } finally {
      setGenerating(false);
      setSendingEmail(false);
    }
  };

  const itemEmoji = (id: string) => id === '1' ? '🧁' : id === '2' ? '🎂' : id === '3' ? '🥐' : '🚚';

  return (
    <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-start animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">

      <div className="bg-slate-950 rounded-card-lg p-8 shadow-2xl border border-white/10">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-2 underline decoration-accent-secondary underline-offset-4">Catering Menu</h2>
          <p className="text-sm text-slate-400">Select items to build your custom catering quote</p>
        </div>

        <ul className="space-y-4" aria-label="Menu items">
          {menuItems.map(item => (
            <li key={item.id} className="group flex items-center justify-between p-4 rounded-card border border-white/5 hover:border-accent-secondary/30 hover:bg-white/5 transition-[border-color,background-color]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-control flex items-center justify-center text-xl group-hover:bg-accent-secondary/20 group-hover:scale-110 transition-[background-color,transform]" aria-hidden="true">
                  {itemEmoji(item.id)}
                </div>
                <div>
                  <div className="font-bold text-slate-200">{item.name}</div>
                  <div className="text-sm text-slate-400">${item.price.toFixed(2)}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => addToCart(item)}
                aria-label={`Add ${item.name} to cart`}
                className="bg-white/10 text-white w-10 h-10 rounded-control flex items-center justify-center hover:bg-accent-secondary transition-colors shadow-md"
              >
                <i aria-hidden="true" className="fas fa-plus"></i>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-12 p-6 bg-white/5 rounded-card border border-white/10 space-y-4">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <i aria-hidden="true" className="fas fa-user-tag text-accent-secondary"></i>
            Client Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pdf-demo-name" className="sr-only">Customer name</label>
              <input
                id="pdf-demo-name"
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                autoComplete="name"
                className="w-full bg-black/30 border border-white/10 text-white rounded-control px-4 py-3 text-sm focus:ring-2 focus:ring-accent-secondary/20 focus:border-accent-secondary transition-[border-color,box-shadow] outline-none placeholder:text-slate-500"
              />
            </div>
            <div>
              <label htmlFor="pdf-demo-email" className="sr-only">Customer email</label>
              <input
                id="pdf-demo-email"
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="Email Address"
                autoComplete="email"
                className="w-full bg-black/30 border border-white/10 text-white rounded-control px-4 py-3 text-sm focus:ring-2 focus:ring-accent-secondary/20 focus:border-accent-secondary transition-[border-color,box-shadow] outline-none placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-deep rounded-card-lg p-8 shadow-2xl border border-white/10 flex flex-col min-h-[500px] relative overflow-hidden text-white">
        <div aria-hidden="true" className="absolute top-0 right-0 w-64 h-64 bg-accent-secondary/10 blur-[100px] rounded-pill -mr-32 -mt-32"></div>
        <div aria-hidden="true" className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-pill -ml-32 -mb-32"></div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black">Live Order Summary</h2>
            <div className="bg-accent-secondary/20 text-accent-secondary text-xxs font-black px-3 py-1.5 rounded-pill uppercase tracking-wider border border-accent-secondary/30" aria-live="polite">
              {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
            </div>
          </div>

          <div className="flex-grow space-y-4 mb-8">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 italic p-12 text-center border-2 border-dashed border-white/5 rounded-card-lg">
                <i aria-hidden="true" className="fas fa-cart-shopping text-4xl mb-4 opacity-20"></i>
                <p>Add items from the menu to build your professional invoice</p>
              </div>
            ) : (
              <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide" aria-label="Cart contents">
                {cart.map(item => (
                  <li key={item.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-card animate-in slide-in-from-right-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-control bg-accent-secondary/20 text-accent-secondary flex items-center justify-center font-bold text-xs" aria-label={`Quantity ${item.quantity}`}>
                        {item.quantity}x
                      </div>
                      <div className="font-bold text-sm">{item.name}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-accent-secondary">${(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="text-white/20 hover:text-danger transition-colors"
                      >
                        <i aria-hidden="true" className="fas fa-times"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-auto space-y-6 pt-6 border-t border-white/10">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Amount Due</p>
                <p className="text-4xl font-black text-white">${total.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xxs text-accent font-bold mb-1 flex items-center justify-end gap-1">
                  <i aria-hidden="true" className="fas fa-circle text-[6px]"></i> Dynamic Generation Ready
                </p>
                <p className="text-slate-500 text-xxs">Tax & Fees calculated in PDF</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="fintech"
                size="lg"
                fullWidth
                onClick={() => generateInvoice(false)}
                disabled={cart.length === 0 || !customerName}
                loading={generating}
                loadingLabel="Building PDF Engine..."
                leadingIcon={<i className="fas fa-file-pdf text-xl" />}
              >
                Download PDF Invoice
              </Button>

              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onClick={() => generateInvoice(true)}
                disabled={cart.length === 0 || !customerName || !customerEmail}
                loading={sendingEmail}
                loadingLabel="Emailing Invoice..."
                leadingIcon={<i className="fas fa-envelope text-lg" />}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/10"
              >
                Send PDF Invoice Email
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
