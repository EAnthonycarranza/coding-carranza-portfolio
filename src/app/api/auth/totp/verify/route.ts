import { NextRequest, NextResponse } from 'next/server';
import * as OTPAuth from 'otpauth';

export async function POST(request: NextRequest) {
  try {
    const { secret, token } = await request.json();
    if (!secret || !token) {
      return NextResponse.json({ error: 'Missing secret or token' }, { status: 400 });
    }

    const totp = new OTPAuth.TOTP({
      issuer: 'Sweet Bytes Demo',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });

    const cleaned = String(token).replace(/\s+/g, '');
    const delta = totp.validate({ token: cleaned, window: 1 });

    return NextResponse.json({ valid: delta !== null, delta });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'TOTP verify failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
