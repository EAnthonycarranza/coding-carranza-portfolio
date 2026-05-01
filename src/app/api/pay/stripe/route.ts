import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { amount, mode, items } = await request.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const amountInCents = Math.round(parseFloat(amount) * 100);

    // --- MODE 1: Hosted Checkout (Redirect) ---
    if (mode === 'checkout') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items?.map((item: any) => ({
          price_data: {
            currency: 'usd',
            product_data: { name: item.name },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.qty,
        })) || [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: 'Custom Order Payment' },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${request.nextUrl.origin}/demo/payment?success=true`,
        cancel_url: `${request.nextUrl.origin}/demo/payment?canceled=true`,
      });

      return NextResponse.json({ url: session.url });
    }

    // --- MODE 2: Payment Intent (Embedded) ---
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Stripe Payment Intent Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
