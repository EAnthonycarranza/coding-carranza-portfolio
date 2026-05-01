import { NextRequest, NextResponse } from 'next/server';
import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const { email, label } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const secret = new OTPAuth.Secret({ size: 20 });
    const totp = new OTPAuth.TOTP({
      issuer: 'Sweet Bytes Demo',
      label: label || email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    });

    const otpauthUrl = totp.toString();
    const qrDataUrl = await QRCode.toDataURL(otpauthUrl, { margin: 1, width: 240 });

    return NextResponse.json({
      secret: secret.base32,
      otpauthUrl,
      qr: qrDataUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'TOTP setup failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
