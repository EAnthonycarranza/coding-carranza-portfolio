import { NextRequest, NextResponse } from 'next/server';
import { shippoClient } from '@/lib/shippo';

export async function POST(request: NextRequest) {
  try {
    const { toAddress } = await request.json();

    if (!toAddress || !toAddress.zip) {
      return NextResponse.json(
        { error: 'Missing destination address or ZIP code' },
        { status: 400 }
      );
    }

    // Create a shipment to get rates
    const shipment = await shippoClient.shipments.create({
      addressFrom: {
        name: 'Coding Carranza HQ',
        street1: '101 Spear St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'US',
        phone: '5551234567',
        email: 'anthony@codingcarranza.com',
      },
      addressTo: {
        name: toAddress.name || 'Potential Customer',
        street1: toAddress.zip === '78233' ? '123 Main St' : (toAddress.zip === '90210' ? '215 N Canon Dr' : '101 Spear St'),
        city: toAddress.zip === '78233' ? 'San Antonio' : (toAddress.zip === '90210' ? 'Beverly Hills' : (toAddress.city || 'San Francisco')),
        state: toAddress.zip === '78233' ? 'TX' : (toAddress.zip === '90210' ? 'CA' : (toAddress.state || 'CA')),
        zip: toAddress.zip,
        country: 'US',
        phone: '5559876543',
        email: 'customer@example.com',
      },
      parcels: [
        {
          length: '10',
          width: '7',
          height: '4',
          distanceUnit: 'in',
          weight: '2',
          massUnit: 'lb',
        },
      ],
      async: false, // Wait for rates to be calculated
    });

    // Return the rates from the shipment
    return NextResponse.json({
      success: true,
      rates: shipment.rates,
      shipmentId: shipment.objectId,
    });
  } catch (error: any) {
    console.error('Shippo API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch shipping rates' },
      { status: 500 }
    );
  }
}
