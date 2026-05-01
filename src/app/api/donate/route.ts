import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const liveSecret = process.env.STRIPE_LIVE_SECRET_KEY;
const stripe = liveSecret ? new Stripe(liveSecret) : null;

const MIN_USD = 1;
const MAX_USD = 5000;

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Donations are not configured.' }, { status: 503 });
  }

  try {
    const { amount, name, message } = await request.json();
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed < MIN_USD || parsed > MAX_USD) {
      return NextResponse.json({ error: `Amount must be between $${MIN_USD} and $${MAX_USD}.` }, { status: 400 });
    }

    const origin = request.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      submit_type: 'donate',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Support Coding Carranza',
              description: 'Thank you for supporting independent dev work!',
            },
            unit_amount: Math.round(parsed * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        source: 'contact-page-donation',
        supporter_name: typeof name === 'string' ? name.slice(0, 100) : '',
        supporter_message: typeof message === 'string' ? message.slice(0, 500) : '',
      },
      success_url: `${origin}/contact?donation=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/contact?donation=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create donation session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
