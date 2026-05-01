import { NextRequest, NextResponse } from 'next/server';
import { payments, checkout } from '@/lib/square';
import { SquareError } from 'square';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceId, amount, locationId, mode, items } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const amountInCents = BigInt(Math.round(parseFloat(amount) * 100));

    // --- MODE 1: Hosted Checkout (Redirect) ---
    if (mode === 'checkout' || request.nextUrl.searchParams.get('mode') === 'checkout') {
      const response = await checkout.paymentLinks.create({
        idempotencyKey: crypto.randomUUID(),
        order: {
          locationId: locationId || process.env.SQUARE_LOCATION_ID || 'L09S2F24W2M8F', 
          lineItems: items?.map((item: any) => ({
            name: item.name,
            quantity: item.qty.toString(),
            basePriceMoney: {
              amount: BigInt(Math.round(item.price * 100)),
              currency: 'USD',
            },
          })) || [
            {
              name: 'Custom Order',
              quantity: '1',
              basePriceMoney: {
                amount: amountInCents,
                currency: 'USD',
              },
            },
          ],
        },
        checkoutOptions: {
          redirectUrl: `${request.nextUrl.origin}/demo/payment?success=true`,
        }
      });

      return NextResponse.json({ url: response.paymentLink?.url });
    }

    // --- MODE 2: Embedded Payment (Direct) ---
    if (!sourceId) {
      return NextResponse.json({ error: 'sourceId is required for embedded payments' }, { status: 400 });
    }

    const response = await payments.create({
      idempotencyKey: crypto.randomUUID(),
      sourceId,
      amountMoney: {
        currency: 'USD',
        amount: amountInCents,
      },
      locationId: locationId || undefined,
    });

    const serializedResult = JSON.parse(
      JSON.stringify(response, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return NextResponse.json({ success: true, result: serializedResult });
  } catch (error) {
    console.error('Square Payment Error:', error);

    if (error instanceof SquareError) {
      return NextResponse.json(
        { error: error.errors?.[0]?.detail || 'Square API Error' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
