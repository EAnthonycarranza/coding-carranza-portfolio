import { NextRequest, NextResponse } from 'next/server';
import { shippoClient } from '@/lib/shippo';

export async function POST(request: NextRequest) {
  try {
    const { rateId } = await request.json();

    if (!rateId) {
      return NextResponse.json(
        { error: 'Missing rate ID' },
        { status: 400 }
      );
    }

    console.log('Purchasing Shippo Label for Rate:', rateId);

    // Purchase the label using the rate ID
    const transaction = await shippoClient.transactions.create({
      rate: rateId,
      async: false,
    });

    console.log('Shippo Transaction Response:', JSON.stringify(transaction, null, 2));

    if (transaction.status === 'ERROR') {
      return NextResponse.json(
        { 
          error: 'Shippo Transaction Error', 
          details: transaction.messages 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error: any) {
    console.error('Shippo Label Exception:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to purchase shipping label' },
      { status: 500 }
    );
  }
}
