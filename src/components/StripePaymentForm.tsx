'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Button from './ui/Button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentFormProps {
  amount: string;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
}

function CheckoutForm({ amount, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1. Create Payment Intent on the server
      const response = await fetch('/api/pay/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        throw new Error(backendError);
      }

      // 2. Confirm the payment on the client
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        onError(result.error.message || 'Payment failed');
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          onSuccess({ payment: { id: result.paymentIntent.id, status: 'COMPLETED' } });
        }
      }
    } catch (err: any) {
      onError(err.message || 'Internal Server Error');
    } finally {
      setLoading(false);
    }
  };

  const cardElementId = 'stripe-card-element';
  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Stripe payment form">
      <div className="p-4 bg-black/40 rounded-card border border-white/10">
        <label htmlFor={cardElementId} className="text-xxs font-black text-slate-300 uppercase tracking-widest mb-3 block">
          Stripe Secure Card Element
        </label>
        <div id={cardElementId} className="py-2">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: 'rgb(241 245 249)',
                  '::placeholder': {
                    color: 'rgb(100 116 139)',
                  },
                  iconColor: 'rgb(148 163 184)',
                },
                invalid: {
                  color: 'rgb(248 113 113)',
                },
              },
            }}
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="fintech"
        size="lg"
        fullWidth
        disabled={!stripe}
        loading={loading}
        loadingLabel="Processing..."
      >
        Pay ${amount} via Stripe
      </Button>
    </form>
  );
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
